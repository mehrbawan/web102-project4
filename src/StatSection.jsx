import React from 'react';

const StatSection = ({ title, data, excludedSet, toggleExclude }) => {
  const isTypeSection = title.toLowerCase() === "types"; // Check if the section is for Types

  return (
    <div className="stats-col">
      <h2>{title}</h2>
      {data.map((item, index) => (
        <button
          key={index}
          type={isTypeSection ? item.name : ''}
          className="attributeButton"
          onClick={() => toggleExclude(item.name)}
          {...(isTypeSection && { "data-type": item.name })} // Conditionally add 'data-type' attribute for types
        >
          {item.name}
        </button>
      ))}

      <div className="excluded-types-container">
        <h3>Excluding:</h3>
        {excludedSet.size > 0 ? (
          <div className="excluded-buttons">
            {Array.from(excludedSet).map((item, index) => (
              <button
                key={index}
                className="excludedButton"
                onClick={() => toggleExclude(item)} // Remove from exclusion list when clicked
              >
                {item} &times; {/* Add '×' symbol to indicate removal */}
              </button>
            ))}
          </div>
        ) : (
          <p>No {title.toLowerCase()} excluded yet.</p>
        )}
      </div>
    </div>
  );
};

export default StatSection;
