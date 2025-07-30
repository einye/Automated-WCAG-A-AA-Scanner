import { getRandomIntInclusive } from "../../../logic/randomNumber";
import ElementScorecard from "../ElementScorecard";

const dummyElements = ['<img>', '<div>', '<h1>', '<h2>'];

export default function ContainerElementScorecards() {
    // IMPORT PASS ICON
    // IMPORT FAIL ICON

    return(
        <div className="flex flex-wrap gap-10">
            {dummyElements.map( (item, index) => {
                let number = getRandomIntInclusive(20, 150);
                let failed = number + 20;
                return <ElementScorecard key={index} elementName={item} score={{passed: number, failed}}/>;
            })}
        </div>
    )
}