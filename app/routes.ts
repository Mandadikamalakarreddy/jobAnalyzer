import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth", "routes/auth.tsx"),
    route("analyze-job", "routes/analyze-job.tsx"),
    route("job-analysis/:id", "routes/job-analysis.tsx"),
    route("interview-prep/:id", "routes/interview-prep.tsx"),
    route("wipe", "routes/wipe.tsx")
] satisfies RouteConfig;
