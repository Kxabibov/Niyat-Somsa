import React from 'react';

const BackgroundAnim: React.FC = () => {
    return (
        <div className="grid-wrapper pointer-events-none fixed inset-0 z-[-1]">
            <div className="grid-background"></div>
        </div>
    );
};

export default BackgroundAnim;
