// backend/utils/sgpaCalculator.js
const Marks = require("../models/Marks");
const Subject = require("../models/Subject");

class SGPACalculator {
  // Calculate SGPA for a student in a semester
  static async calculateSGPA(studentId, semester) {
    try {
      // Get all marks for the student in this semester
      const marks = await Marks.find({
        studentId,
        semester,
      }).populate("subjectId", "credits");

      if (marks.length === 0) {
        return {
          sgpa: 0,
          totalCredits: 0,
          earnedCredits: 0,
          subjects: [],
        };
      }

      let totalGradePoints = 0;
      let totalCredits = 0;
      let earnedCredits = 0;
      const subjectDetails = [];

      for (const mark of marks) {
        const credits = mark.subjectId.credits;
        totalCredits += credits;

        if (mark.gradePoint !== null) {
          totalGradePoints += mark.gradePoint * credits;
          earnedCredits += mark.creditsEarned;
        }

        subjectDetails.push({
          subjectCode: mark.subjectId.subjectCode,
          subjectName: mark.subjectId.subjectName,
          credits,
          grade: mark.grade,
          gradePoint: mark.gradePoint,
          totalMarks: mark.totalMarks,
        });
      }

      const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

      return {
        sgpa: Math.round(sgpa * 100) / 100,
        totalCredits,
        earnedCredits,
        subjects: subjectDetails,
      };
    } catch (error) {
      throw error;
    }
  }

  // Calculate CGPA across all semesters
  static async calculateCGPA(studentId) {
    try {
      // Get all marks for the student
      const marks = await Marks.find({
        studentId,
      }).populate("subjectId", "credits");

      if (marks.length === 0) {
        return {
          cgpa: 0,
          totalCredits: 0,
          earnedCredits: 0,
          semesterWise: {},
        };
      }

      // Group by semester
      const semesterMap = {};
      let totalGradePoints = 0;
      let totalCredits = 0;
      let earnedCredits = 0;

      for (const mark of marks) {
        const sem = mark.semester;
        if (!semesterMap[sem]) {
          semesterMap[sem] = {
            totalGradePoints: 0,
            totalCredits: 0,
            earnedCredits: 0,
          };
        }

        const credits = mark.subjectId.credits;
        semesterMap[sem].totalCredits += credits;
        totalCredits += credits;

        if (mark.gradePoint !== null) {
          semesterMap[sem].totalGradePoints += mark.gradePoint * credits;
          semesterMap[sem].earnedCredits += mark.creditsEarned;
          totalGradePoints += mark.gradePoint * credits;
          earnedCredits += mark.creditsEarned;
        }
      }

      // Calculate semester-wise SGPA
      const semesterWise = {};
      Object.keys(semesterMap).forEach((sem) => {
        const data = semesterMap[sem];
        semesterWise[sem] = {
          sgpa:
            data.totalCredits > 0
              ? Math.round((data.totalGradePoints / data.totalCredits) * 100) /
                100
              : 0,
          totalCredits: data.totalCredits,
          earnedCredits: data.earnedCredits,
        };
      });

      const cgpa =
        totalCredits > 0
          ? Math.round((totalGradePoints / totalCredits) * 100) / 100
          : 0;

      return {
        cgpa,
        totalCredits,
        earnedCredits,
        semesterWise,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get transcript for a student
  static async getTranscript(studentId) {
    try {
      const marks = await Marks.find({ studentId })
        .populate("subjectId", "subjectCode subjectName credits")
        .sort({ semester: 1 });

      // Group by semester
      const transcript = [];
      let currentSemester = null;
      let semesterData = null;

      for (const mark of marks) {
        if (mark.semester !== currentSemester) {
          if (semesterData) {
            // Calculate SGPA for this semester
            const sgpaData = await this.calculateSGPA(
              studentId,
              currentSemester,
            );
            semesterData.sgpa = sgpaData.sgpa;
            transcript.push(semesterData);
          }

          currentSemester = mark.semester;
          semesterData = {
            semester: currentSemester,
            subjects: [],
            totalCredits: 0,
            earnedCredits: 0,
            sgpa: 0,
          };
        }

        semesterData.subjects.push({
          subjectCode: mark.subjectId.subjectCode,
          subjectName: mark.subjectId.subjectName,
          credits: mark.subjectId.credits,
          iaMarks: {
            ia1: mark.ia1,
            ia2: mark.ia2,
            ia3: mark.ia3,
            bestIa: mark.bestIa,
          },
          labInternal: mark.labInternal,
          semesterExam: mark.semesterExam,
          totalMarks: mark.totalMarks,
          grade: mark.grade,
          gradePoint: mark.gradePoint,
          creditsEarned: mark.creditsEarned,
        });

        semesterData.totalCredits += mark.subjectId.credits;
        semesterData.earnedCredits += mark.creditsEarned;
      }

      // Add last semester
      if (semesterData) {
        const sgpaData = await this.calculateSGPA(studentId, currentSemester);
        semesterData.sgpa = sgpaData.sgpa;
        transcript.push(semesterData);
      }

      // Calculate CGPA
      const cgpaData = await this.calculateCGPA(studentId);

      return {
        transcript,
        cgpa: cgpaData.cgpa,
        overallCredits: cgpaData.totalCredits,
        overallEarned: cgpaData.earnedCredits,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SGPACalculator;
