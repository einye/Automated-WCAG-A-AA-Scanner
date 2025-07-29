import { roundStyles1 } from "../../../constants/styles"
import './index.css';

export default function HeroText({bigText, smallText}) {
    return(
        <div className={`${roundStyles1} ${"hero-text-div"}
        ${"flex flex-col max-w-md gap-4"}
        ${"p-4 border-2 border-slate-700"}
        ${"shadow-lg backdrop-blur-sm mix-blend-normal"}`}>
            <p className="text-3xl">{bigText}</p>
            <p className="text-lg">{smallText}</p>
        </div>
    )
}
