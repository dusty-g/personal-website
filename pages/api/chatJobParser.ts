import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({

    apiKey: process.env.OPENAI_API_KEY,
  });

const systemContext = {
    "role":"system",
    "content":`
    The user is going to submit a job description for a job they just applied for. They want to add the job to a database they are using to track their applications.

Your job is to parse the job description and return a newJob json object that has fields described below.

The database has 'jobs' that have the following fields:
newJob = {
            companyName: string,
            jobTitle: string,
            jobUrl: string,
            jobDescription: string,
            applicationStatus: string,
            salary: string
        }

If you are unable to find a given field in the text, just leave it out of the object.



Try to keep the jobDescription as brief as possible. ex: "Front-End Software Engineer at Amazon working on the Kindle team"

'salary' may be a range like $85,000 - $120,000. Leave out things like "+bonus". The user is in Washington if there are different ranges for different states.

'applicationStatus' should be "Applied".

Return only the json object please.

    `
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.body.messages || !Array.isArray(req.body.messages)) {
          return res.status(400).json({ error: 'Invalid request body, messages array is required.' });
        }

        let temp_messages = [...req.body.messages];
        temp_messages.unshift(systemContext);
        const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: temp_messages,
        temperature: 0.2
        });
        res.status(200).json(completion.choices[0].message);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong.' });
  }
}