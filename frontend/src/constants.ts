export let backendURL: string;
if (process.env.NODE_ENV === "development") {
  backendURL = "http://localhost:4000";
} else {
  backendURL = "https://todoapp-xed76c3trq-uc.a.run.app";
}
