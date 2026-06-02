import React from 'react'

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-300 border-t-primary dark:border-gray-700 dark:border-t-primary"></div>
        </div>
    );
}

export default Loader
