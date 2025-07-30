import Topbar from "../topbar";

export default function ContentContainer({children}) {
    return (
        <>
        <Topbar />
        <div className="w-full h-full px-20">
            {children}
        </div>
        </>
    );
}