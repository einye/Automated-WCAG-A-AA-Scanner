import TabsBar from "../../../../components/Output/TabsBar";
import { tabslist } from "../../../../constants/words";

export default function WebsiteScanInteractiveWindow() {
    return (
        <div>
            <TabsBar tabsArray={tabslist}/>
        </div>
    )
}