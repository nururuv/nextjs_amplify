import Head from "next/head";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: String;
}

export default function Layout({ children, title }: Props) {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </div>
  );
}
