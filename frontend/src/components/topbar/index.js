import Logo from "./Logo";
import LearnTopbar from "./Learn";
import Navbar from "./Navbar/Index";

export default function Topbar() {
    return (
        <div className={`
        ${"flex justify-between items-center"}
        ${"px-12"}
        ${"bg-transparent backdrop-blur-md shadow-md"}`}>
        <Logo />
        <Navbar />
        <LearnTopbar />
        </div>
    );
}