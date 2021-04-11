import axios from "axios";
import Link from "next/link";
import React from "react";

interface dbType {
  rows: any[];
  dbName: string;
  dbId: string;
  schema: any;
}

const Index = ({ data }): JSX.Element => {
  return (
    <div>
      {data.map((db: dbType, i: number) => {
        return (
          <Link key={i} href={`/${db.dbId}`}>
            <div>{db.dbName}</div>
          </Link>
        );
      })}
    </div>
  );
};

export const getStaticProps = async () => {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/getData",
  }).then((res) => {
    return res.data;
  });

  return {
    props: { data: res.dbs },
  };
};

export default Index;
