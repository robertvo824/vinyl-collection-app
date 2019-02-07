const bodyParser = require("body-parser"),
methodOverride   = require("method-override"),
mongoose         = require("mongoose"),
express          = require("express"),
app              = express();


// connect to DB
mongoose.connect("mongodb://localhost:27017/vinyls", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

// Schema setup
var vinylSchema = new mongoose.Schema({
    artist: String,
    album: String,
    image: String,
    description: String
})


// compile into model
const Vinyl = mongoose.model('Vinyl', vinylSchema);


// Landing Page
app.get("/", (req, res) => {
    res.render("landing");
});

// index shows all vinyl collection
app.get("/vinyls", (req, res) => {
    // get data from DB
    Vinyl.find({}, (err, allVinyls) => {
        if(err){
            console.log(err);
        } else {
            res.render("index", {vinyls: allVinyls});
        }
    })

    // get data from ARRAY
    // res.render("index", {vinyls: vinyls});
})

// add another vinyl
app.post("/vinyls", (req, res) => {
    // get data from form
    var artist = req.body.artist;
    var album = req.body.album;
    var image = req.body.image;
    var description = req.body.description;

    var newVinyl = {artist: artist, album: album, image: image, description:description};
    Vinyl.create(
    newVinyl, (err, newVinyl) => {
        if(err){
            console.log(err);
        } else {
            console.log("Newly Added Vinyl");
            console.log(newVinyl);
            // redirect back to vinyls page
            res.redirect("/vinyls");
        }
    });
});

// form for new vinyl
app.get("/vinyls/new", (req, res) => {
    res.render("new");
});

app.get("/vinyls/:id", (req, res) => {
    // find vinyl with provided id
    Vinyl.findById(req.params.id, (err, foundVinyl) => {
        if(err){
            console.log(err);
        } else {
            // render show template with that vinyl
            res.render("show", {vinyl: foundVinyl});
        }
    })
})

app.get("/vinyls/:id/edit", (req, res) => {
    Vinyl.findById(req.params.id, (err, foundVinyl) => {
        if(err){
            res.render("/vinyls");
        } else {
            res.render("edit", {vinyl: foundVinyl});
        }
    });
});

app.put("/vinyls/:id", (req, res) => {
    Vinyl.findOneAndUpdate(req.params.id, {$set: req.body.vinyl}, (err, updatedVinyl) => {
        if(err){
            res.redirect("/vinyls");
        } else {
            res.redirect("/vinyls/" + req.params.id);
        }
    });
});

// get server running
app.listen("5000", "127.0.0.1", () => {
    console.log("Vinyl Collection Server Started!");
});
