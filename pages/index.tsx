import Layout from "../components/Layout";
import React from "react";
import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

function Home() {
  return (
    <Layout title="Json">
      <h1>Hello World</h1>
    </Layout>
  );
}

export default withAuthenticator(Home);
