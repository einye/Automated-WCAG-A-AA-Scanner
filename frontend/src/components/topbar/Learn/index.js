import { learnTopbar } from "../../../constants/words";
import { btnStyles } from "../../../constants/styles";

export default function LearnTopbar() {
    return (
        <button className={btnStyles}>
            {learnTopbar}
        </button>
    )
}
