import React from "react";

function Home() {

  return (
    <div>
      <h1>Welcome Home {user && user.name}</h1>
    </div>
  );
}

export default Home;
