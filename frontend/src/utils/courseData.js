// Stream groupings
export const CSE_IT_STREAMS = ["CSE", "IT", "Data Science", "CSBS"];
export const NON_CSE_STREAMS = ["ECE", "EE", "Chemical Engineering", "AEIE"];
export const MECH_CIVIL_STREAMS = ["Mechanical", "Civil Engineering"];

export const ALL_STREAMS = [
  "CSE", "ECE", "Mechanical", "EE", "Chemical Engineering",
  "Civil Engineering", "IT", "AEIE", "Data Science", "CSBS",
];

export const COURSES = {
  CSE_IT: [
  { id: "frontend", name: "Frontend", fee: 826, base: 700, gst: 18 },
  { id: "backend", name: "Backend", fee: 826, base: 700, gst: 18 },
  { id: "automation_testing", name: "Automation Testing", fee: 826, base: 700, gst: 18 },

  
  { id: "mern", name: "MERN Stack Development", fee: 1180, base: 1000, gst: 18 },
  { id: "python_react", name: "Python with React", fee: 1180, base: 1000, gst: 18 },
  { id: "java_angular", name: "Java with Angular", fee: 1180, base: 1000, gst: 18 },

  { id: "aws", name: "AWS (Cloud Practitioner & Solution Architect)", fee: 1180, base: 1000, gst: 18 },
  { id: "data_analyst", name: "Data Analyst – Dashboards, Reporting, SQL, Excel/Power BI tools", fee: 1003, base: 850, gst: 18 },
  { id: "data_scientist", name: "Data Scientist – ML models, Predictions, Statistical Analysis", fee: 1003, base: 850, gst: 18 },
  { id: "ml_engineer", name: "ML Engineer – Deploying and Optimizing Machine Learning Models", fee: 1180, base: 1000, gst: 18 },
],
  NON_CSE: [
    { id: "frontend", name: "Frontend", fee: 826, base: 700, gst: 18 },
    { id: "backend", name: "Backend", fee: 826, base: 700, gst: 18 },
    { id: "automation_testing", name: "Automation Testing", fee: 826, base: 700, gst: 18 },
    { id: "advanced_office", name: "Advanced Office Management with AI", fee: 1180, base: 1000, gst: 18 },
    { id: "aws", name: "AWS (Cloud Practitioner & Solution Architect)", fee: 1180, base: 1000, gst: 18 },
    { id: "raspberry_pi", name: "Raspberry Pi + IOT", fee: 826, base: 700, gst: 18 },
    { id: "matlab", name: "Matlab + Embedded Systems", fee: 826, base: 700, gst: 18 },
    { id: "embedded_iot", name: "Embedded Systems + IOT", fee: 826, base: 700, gst: 18 },
  ],
  MECH_CIVIL: [
    { id: "autocad", name: "AutoCAD", fee: 826, base: 700, gst: 18 },
    { id: "creo", name: "CREO Parametrics", fee: 826, base: 700, gst: 18 },
    { id: "advanced_office", name: "Advanced Office Management with AI", fee: 1180, base: 1000, gst: 18 },
  ],
};

export function getCourseGroup(stream) {
  if (CSE_IT_STREAMS.includes(stream)) return "CSE_IT";
  if (NON_CSE_STREAMS.includes(stream)) return "NON_CSE";
  if (MECH_CIVIL_STREAMS.includes(stream)) return "MECH_CIVIL";
  return null;
}

export function getCoursesForStream(stream) {
  const group = getCourseGroup(stream);
  if (!group) return [];
  return COURSES[group];
}

export function getGroupLabel(stream) {
  if (CSE_IT_STREAMS.includes(stream)) return "CSE / IT / Data Science";
  if (NON_CSE_STREAMS.includes(stream)) return "Non-CSE";
  if (MECH_CIVIL_STREAMS.includes(stream)) return "Mechanical / Civil Engineering";
  return "";
}