const loginWith = async (page, username, password) => {
  const textBoxes = await page.getByRole("textbox").all();
  await textBoxes[0].fill(username);
  await textBoxes[1].fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const initTestBase = async (page, request) => {
  await request.post("/api/testing/reset");
  await request.post("/api/users", {
    data: {
      name: user_t_k.name,
      username: user_t_k.username,
      password: user_t_k.password,
    },
  });
  await request.post("/api/users", {
    data: {
      name: user_p_r.name,
      username: user_p_r.username,
      password: user_p_r.password,
    },
  });
  await page.goto("/");
};

const createBlog = async (page) => {
  await page.getByRole("button", { name: "Open Blog creation" }).click();
  const textBoxes = await page.getByRole("textbox").all();
  await textBoxes[0].fill("aihe");
  await textBoxes[1].fill("kirjoittaja");
  await textBoxes[2].fill("linkki");
  await page.getByRole("button", { name: "Create" }).click();
};

const user_t_k = {
  name: "Tee Kämänen",
  username: "teekämä",
  password: "sikret",
};

const user_p_r = {
  name: "Päivi Rämänen",
  username: "peerämä",
  password: "dontsay",
};

export { loginWith, initTestBase, createBlog, user_t_k, user_p_r };
