import { getRandomIntInclusive } from "../../../logic/randomNumber";
import ElementScorecard from "../ElementScorecard";

const dummyElements = ['<img>', '<div>', '<h1>', '<h2>'];

export default function ContainerElementScorecards() {

    return(
        <div className="flex flex-wrap gap-10">
            {dummyElements.map( (item, index) => {
                let number = getRandomIntInclusive(20, 150);
                let total = number + 20;
                return <ElementScorecard key={index} elementName={item} score={{passed: number, total}}/>;
            })}
        </div>
    )
}