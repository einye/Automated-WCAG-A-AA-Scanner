import './index.css';
import { containerStyles, flexDownwards } from "../../../constants/styles";
import { roundStyles } from "../../../constants/styles";
import { Link } from 'react-router-dom';
import { slugify } from '../../../logic/createSlug';

export default function ElementScorecard({ elementName, score:{passed, failed} } ) {
    const urlSlug = slugify(elementName);
    return (
        <Link to={urlSlug} >
            <div className={`element-scorecard
            ${flexDownwards} ${roundStyles}
            ${containerStyles}
            ${'w-fit'}
            ${'bg-white bg-opacity-75'}
            `}>
                <h1>{elementName}</h1>
                <h2> O {passed} passed | X {failed} failed</h2>
            </div>
        </Link>
    )
}