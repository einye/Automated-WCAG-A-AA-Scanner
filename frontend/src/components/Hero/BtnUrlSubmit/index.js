import { API_ENDPOINTS, urlSubmit } from "../../../constants/words";
import { btnStyles} from "../../../constants/styles";
import { useNavigate} from 'react-router-dom';
import { SendUrl } from "../../../logic/apiPostRequests";
import { encryptUrl } from "../../../logic/crypts";

export default function UrlSubmit({value}) {
    let navigate = useNavigate();
    
    const handleClick = () => {
        // check url exists
        // send url to backend
        SendUrl(API_ENDPOINTS.SCAN_URL, value)
        .then(({response, data, error}) => {
            if (error) console.error(error);
            else {
                console.log("From Results object, data: ", data);
            }
        });
        // Store results in HIGHER STATE
        // Calculate website unique uri
        const targetUrl = encryptUrl(value)
        // navigate to loading page using the uri
        navigate(targetUrl);
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
