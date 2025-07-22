import { API_ENDPOINTS, btnStyles, urlSubmit } from "../../../constants/words";
import { useNavigate} from 'react-router-dom';
import { SendUrl } from "../../../logic/apiPostRequests";

export default function UrlSubmit({value}) {
    let navigate = useNavigate();
    
    const handleClick = () => {
        // check url exists
        // send url to backend
        SendUrl(API_ENDPOINTS.SCAN_URL, value);
        // navigate to loading page
        navigate('/output');
    };

    return (
        <>
        <button className={btnStyles} onClick={handleClick}>
            {urlSubmit}
        </button>
        <p>{value}</p>
        </>
    )
}
