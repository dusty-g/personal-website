import { useRouter } from "next/router";
import { useEffect } from "react";
import JobSearchLogEntry from "src/components/jobSearchEntry";

export default function UpdateJobEntry() {
    // get the jobId from the URL
    const router = useRouter();
    const { jobId } = router.query;
    
    return (
        <JobSearchLogEntry mode={"update"} jobSearchEntryId={jobId}/>
    )
}