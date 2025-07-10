import { bigText, smallText } from "../../constants/words";
import HeroText from "./HeroText";
import UrlField from "./UrlField";
import UrlSubmit from "./UrlSubmit";
import AboutWCAG from "./AboutWCAG";

export default function Hero() {
    return (
        <div className={`
        ${"pt-16 px-12"}
        ${"flex justify-between items-start"}
        ${"w-full flex-grow"}`}>
            <LeftSide />
            <UrlField />
            <UrlSubmit />
        </div>
    )
}

function LeftSide() {
    return (
        <div className="flex flex-col justify-between gap-4">
        <HeroText bigText={bigText} smallText={smallText}/>
        <AboutWCAG />
        </div>
    );
}
