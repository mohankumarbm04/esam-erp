// components/common/Card.jsx
import React from "react";

const Card = ({
  children,
  title,
  subtitle,
  icon: Icon, // This is correct - it renames 'icon' prop to 'Icon' component
  action,
  className = "",
  hoverable = true,
  bordered = false,
  gradient = false,
}) => {
  const baseClasses =
    "bg-white rounded-xl overflow-hidden transition-all duration-300";

  const hoverClasses = hoverable ? "hover:shadow-xl hover:-translate-y-1" : "";
  const borderClasses = bordered ? "border border-gray-200" : "shadow-md";
  const gradientClasses = gradient
    ? "bg-gradient-to-br from-blue-50 to-indigo-50"
    : "";

  const classes = [
    baseClasses,
    hoverClasses,
    borderClasses,
    gradientClasses,
    className,
  ].join(" ");

  return (
    <div className={classes}>
      {/* Only show header if there's content */}
      {(title || subtitle || Icon || action) && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center">
            {Icon && ( // Check if Icon prop exists
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
