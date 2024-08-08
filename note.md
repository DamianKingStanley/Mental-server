```javascript
//@ FOR POSTS ENDPOINT
//
@create posts
app.post("/posts", async (req, res) => {
  try {
    const post = req.body;
    const newPost = await postModel.create(post);
    console.log(post);
    res.status(200).json({ message: "post sent succesfully", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@fetch all posts
THE SAME WITH WHAT IS ABOVE
app.get("/posts", async (req, res) => {
  try {
    const fetchPosts = await postModel.find({});
    res.status(200).json({ message: "succesful", fetchPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@ edit posts
app.put("/posts/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);
    const updatePosts = await postModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    console.log(updatePosts);
    res.status(200).json({ message: "Updated succesfully", updatePosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@ delete post
app.delete("/posts/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await postModel.findByIdAndRemove(id);

    res.status(200).json({ message: "deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@get a single post
app.get("/post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const SinglePost = await postModel.findById(id);
    console.log(SinglePost);
    res.status(200).json({ message: "Fetch succesfully", SinglePost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
//
//
//
//
//
//

// @FOR USERS ENDPOINT
//
//users login
app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const newUser = await userModel.create(user);
    res.status(200).json({ message: "Login was succesful", newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @fetch all users
app.get("/users", async (req, res) => {
  try {
    const fetchUsers = await userModel.find({});
    res.status(200).json({ message: "succesful", fetchUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@FOR USER REGISTER AND LOGIN
//REGISTER A USER
app.post("/user/register", async (req, res) => {
  try {
    const userInfo = req.body;
    const oldUser = await userModel.findOne({ email: userInfo.email });
    if (oldUser) {
      return res.status(401).json({ message: "email already exist" });
    }
    const hashPassword = await bcrypt.hash(userInfo.password, 12);
    const user = await userModel.create({
      fullname: `${userInfo.FirstName} ${userInfo.LastName}`,
      email: userInfo.email,
      password: hashPassword,
password: userInfo.password,(to see the password)
    });
    console.log(userInfo);
    res.status(200).json({ message: "Registration succesfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// LOGIN A USER
app.post("/user/login", async (req, res) => {
  try {
    const secret = "abcd123aa";
    const userInfo = req.body;
    const oldUser = await userModel.findOne({ email: userInfo.email });
    if (!oldUser) {
      return res.status(401).json({ message: "wrong email" });
    }
    const checkPassword = await bcrypt.compare(
      userInfo.password,
      oldUser.password
    );
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid credential" });
    }
    // to log you out after some time
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "1h",
    });
    // to show some info only
    const formattedResult = {
      email: oldUser.email,
      fullname: oldUser.fullname,
      id: oldUser._id,
    };
    res.status(200).json({ result: formattedResult, token });
    // res.status(200).json({ message: "Login succesfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
https://mental.inkypen.com.ng
```
