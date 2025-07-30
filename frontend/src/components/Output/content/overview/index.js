import { sampleDescription } from "../../../../constants/words"

export default function WebsiteScanOverview({overallScore=89, customDescription=sampleDescription}) {
    return(
        <div className="w-full max-h-max flex justify-center gap-32">
            <h1 className="text-3xl">Your Overall <br/> Score: {overallScore}</h1>
            <p className="max-w-60">{customDescription}</p>
        </div>
    )
}