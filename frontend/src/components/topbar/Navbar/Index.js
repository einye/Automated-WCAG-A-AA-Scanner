import { navlist } from "../../../constants/words";
import { Link} from "react-router-dom";

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
                <Link to={item.path}>
                    <li key={index} className="text-xl font-semibold px-4">{item.name}</li>
                </Link>
            ))}
        </ul>
    )
}