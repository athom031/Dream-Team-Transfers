function App() {
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    initializeDB().then((data) => {
      getTeamData().then(data => setTeamData(data));
    });
  }, []);

  if (teamData === null) {
    return <div>Loading...</div>;
  } else if (!teamData.team_picked) {
    return (
      <div>
        <h1>
          Team not picked yet!
        </h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>
          Team picked: {teamData.team_name}
        </h1>
      </div>
    );
  }
}
