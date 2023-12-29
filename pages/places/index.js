import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "reactstrap";

const PlacesPage = () => {
  const { data: session, status } = useSession();
  if (status == "authenticated") {
    console.log(session);
  }
  return (
    <div>
      <h1>PLACES PAGE</h1>
      <Button className="bg-primary" href={`places/addPlace`}>
        Suggest Place
      </Button>
    </div>
  );
};

export default PlacesPage;
