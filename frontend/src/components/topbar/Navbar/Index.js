import { navlist } from "../../../constants/words";
// test
console.log(navlist);

export default function Navbar() {
    return (
    <div className="p-5 max-h-fit">
        <Navlist />
    </div>
    )
}

function Navlist() {
    return (
        <ul className="flex justify-between">
            {navlist.map((item, index) => (
                <li key={index} 
                className="text-xl font-semibold px-4">{item}</li>
            ))}
        </ul>
    )
}