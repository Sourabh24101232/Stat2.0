import React from 'react'

const Title = ({ title, subTitle }) => {
    return (
        <>
            <h1 className="font-medium text-3xl">{title}</h1>
            <p className="mt-2 max-w-156 text-sm text-gray-500/90 dark:text-gray-400 md:text-base"> {subTitle}</p>
        </>
    );
};

export default Title;
