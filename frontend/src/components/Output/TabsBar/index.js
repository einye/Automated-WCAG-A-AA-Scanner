import { NavLink } from "react-router-dom"
import { containerStyles, roundStyles } from "../../../constants/styles"

export default function TabsBar({tabsArray, baseUrl}) {
    return(
        <div className={`${'flex justify-around'}
        ${'max-w-max'}
        ${roundStyles}
        ${'py-1 px-2'}
        ${'shadow-md bg-gray-200 bg-opacity-50 backdrop-blur-xl'}
        `}>
            {tabsArray.map( (item, index) => (
                <TabInBar  key={index} tabObject={item}/>
            ))}
        </div>
    );
}

function TabInBar({tabObject}) {
    const path = `results/${tabObject.pathAppendage}`;

    return(
        <>
        <NavLink to={path} className={ ( { isActive } ) =>
        `${roundStyles}
        ${'min-w-10 max-w-max px-2 py-1 mx-1'}
        ${isActive ? 'bg-blue-300 shadow-md' : 'bg-transparent \
        hover:bg-blue-200 transition-colors duration-\
        hover:shadow-lg \
        '}
        $
        `}>
            {tabObject.name}
        </NavLink>
        </>
    );
}