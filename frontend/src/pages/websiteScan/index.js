import { useNavigate, useParams } from "react-router-dom";
import ContentContainer from "../../components/ContentContainer";
import { decryptUrl } from "../../logic/crypts";
import TabsBar from "../../components/Output/TabsBar";
import { tabslist } from "../../constants/words";
import WebsiteScanContent from "../../components/Output/content";
import WebsiteScanOverview from "../../components/Output/content/overview";

export default function WebsiteScan() {
    let isLoading = true;
    let navigate = useNavigate();
    // USEPARAMS
    const { websiteScan, outputTab, htmlElement } = useParams();

    // Display Analysis for one html Element (on a Modal)
    if (htmlElement) {

    }

    // Change active tab and corresponding content
    if (outputTab) {

    } else {
        navigate('scores');
    }

    if (decryptUrl(websiteScan)) {

    }

    const validate = (websiteScan) => {
        return 0;
    }

    const fetchResults = () => {
        // send a get request to backend for the results object

        // once received
        // while or if statement

        // from app state, obtain url and encrypt
        // 
        // navigate to website scan
    }
    const prepareResultsPage = () => {

    }
    // 
    if (true) {
        return (
        <ContentContainer>
            <WebsiteScanContent>
                <WebsiteScanOverview />
                <TabsBar tabsArray={tabslist}/>
            </WebsiteScanContent>
        </ContentContainer>
    )}
}


export function Loading() {

    return(
        <>
        <ContentContainer>
            <h1>Loading page...</h1>
            <h1>Loading page...</h1>
            <h1>Loading page...</h1>
            <h1>Loading page...</h1>
        </ContentContainer>
        
        <h1>Loading page...</h1>
        </>
    )
}
