export function setupOrgsCommand(program) {
  program.command("select-org [orgname]").action((opt) => {
    console.log(`Selecting ${opt} as default org`);
    localStorage.setItem("activeOrg", opt);
    const orgs = localStorage.getItem("orgs");

    if (!orgs) {
      return localStorage.setItem("orgs", JSON.stringify([opt]));
    }
    const allOrgs = JSON.parse(orgs);
    allOrgs.push(opt);
    localStorage.setItem("orgs", JSON.stringify(allOrgs));
    console.log(`Now using ${opt} as default org`);
  });

  program.command("ls-orgs").action(() => {
    try {
      const orgs = JSON.parse(localStorage.getItem("orgs"));
      console.table(orgs);
    } catch (err) {
      console.error(handleError);
    }
  });
  program.command("use").requiredOption("-o, --org", "Org to use");
}
