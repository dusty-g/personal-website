import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

// Initialize OpenAI API
const configuration = new Configuration({

  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// The system message helps set the behavior of the assistant.
const systemContext = {
    "role":"system", 
    "content": process.env.SYSTEM_CONTEXT + ` 
   

Summary:
    Software developer with 2 years of experience in developing and deploying features and enhancements for various 
    projects at Amazon using Java, AWS and JavaScript. Skilled in web programming, data structures, algorithms and 
    object-oriented design. Completed Amazon Technical Academy, a full-time 9-month instructor led software development 
    training program. Looking for new opportunities to apply my skills and experience in software development.
EXPERIENCE:
Technical Support Engineer - Salesforce
Nov 2023 - Present

Supports Marketing Cloud Engagement, specifically Mobile products such as MobileConnect (SMS marketing), MobilePush (push notifications and SDK support), and WhatsApp.

Software Development Engineer - Amazon.com, Seattle
    January 2021 - March 2023
        - Designed, developed and deployed features and enhancements for the Kindle Rewards program using Java, Kotlin, AWS 
          and JavaScript.
        - Created a widget that displays Kindle Rewards balance to increase customer engagement.
        - Improved customer satisfaction and loyalty by adding personalized book recommendations based on customer 
          preferences and behavior to Kindle Rewards home page.
        - Boosted Kindle Rewards engagement rates by building a dynamic awareness message at checkout that notifies 
          eligible customers they have earned points, and links to the Rewards home page.
        - Ensured high availability and reliability of Kindle Rewards services by participating in an on-call rotation 
          and resolving issues in a timely manner.
        - Optimized delivery experience and reduced costs by contributing to a framework that selects the best ship 
          option for each order based on various factors such as location, inventory and demand.
        - Streamlined code review process and reduced operational load from partner teams by creating an automated tool 
          that checks code quality and compliance using Java and AWS Lambda.
        - Completed Amazon Technical Academy, a full-time 9-month instructor led software development training program 
          that covers topics such as data structures, algorithms, object-oriented design, web development, databases, 
          cloud computing and more.
Prime Air Flight Operations - Amazon.com, Seattle
    July 2019 - January 2021
        - Performed pre-flight checks and inspections of drone systems and components.
        - Monitored and recorded flight data and telemetry using software tools and sensors.
        - Troubleshot and resolved technical issues and malfunctions during test flights.
        - Provided feedback and recommendations to engineers and developers on drone performance and functionality.
        - Followed safety protocols and regulations to ensure compliance and minimize risks.
Additive Manufacturing Technician - Jabil, Seattle
    March 2018 - July 2019
        - Configured and optimized build parameters and settings for various polymer materials and geometries.
        - Performed post-processing operations such as de-powdering, cleaning, and inspection of printed parts.

SKILLS:
    Java | AWS | JavaScript | React | Data Structures | Algorithms | Object-Oriented Design | Web Development
    `};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({ error: 'Invalid request body, messages array is required.' });
    }

    let temp_messages = [...req.body.messages];
    temp_messages.unshift(systemContext);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: temp_messages,
      temperature: 0.2,
      max_tokens: 80
    });


    res.status(200).json(completion.data.choices[0].message);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong.' });
  }
}