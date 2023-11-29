import { useRouteError } from "react-router-dom";
const containerStyle: React.CSSProperties = {
  margin: "auto",
  display: "flex",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
};
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" style={containerStyle}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
