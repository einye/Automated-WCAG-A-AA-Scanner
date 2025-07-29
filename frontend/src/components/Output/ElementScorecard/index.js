import './index.css';
import { containerStyles, flexDownwards } from "../../../constants/styles";
import { roundStyles } from "../../../constants/styles";

export default function ElementScorecard({ elementName, score:{passed, total} } ) {
    return (
        <div className={`element-scorecard
        ${flexDownwards} ${roundStyles}
        ${containerStyles}
        ${'w-fit'}
        ${'bg-white bg-opacity-75'}
        `}>
            <h1>{elementName}</h1>
            <h2>{passed}/{total}</h2>
        </div>
    )

}