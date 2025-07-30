import { bigText, smallText } from "../../constants/words";
import HeroText from "./HeroText";
import UrlField from "./UrlField";
import UrlSubmit from "./BtnUrlSubmit";
import AboutWCAG from "./BtnAboutWCAG";
import { useState } from "react";

export default function Hero() {
    return (
        <div className={`
        ${"pt-16 px-12"}
        ${"flex justify-between items-start"}
        ${"w-full flex-grow"}`}>
            <LeftSide />
            <UrlParent />
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

function UrlParent() {
    const [input, setInput] = useState('https://mgalaw.co.ke');

    const handleChange = (event) => {
        setInput(event.target.value)
    };

    return(
        <div>
            <UrlField value={input} handleChangeValue={handleChange}/>
            <UrlSubmit value={input} handleChangeValue={handleChange}/>
        </div>
    )
}