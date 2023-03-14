const { Thought, User } = require("../models");

const thoughtController = {
    //get all thougths
    getAllThought (req, res){
        Thought.find({})
        .potulate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .sort({_id: -1})
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },
    //get one thought by ID
    getThoughtById({ params }, res){
        Thought.findOne({_id: params.id })
        .potulate({
            path: "reactions", 
            select: "-__v",
        })
        .select("-__v")
        .then((dbThoughtData) =>{
            if (!dbThoughtData){
                return res.status(404).josn({message:"No thought with this id!"});
            }
            res.josn(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    //create Thought
    createThough ({params, body}, res){
        Thought.create(body)
        .then(({_is}) =>{
            return User.findOneAndUpdate(
                { _id: body.userId }, 
                {$push: { thoughts: _id}}, 
                {new: true}
            );
        })
        .then((dbUserData) =>{
            if (!dbUserData){
                return res
                .status(404)
                .json({message:"hought created but no user with this id!"});
            }
            res.json({ message:"Thought successfully created!"});
        })
        .catch((err) => res.json(err));
    },

    //update thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, {
            new:true,
            runValidators: true,
        })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                res.status(404).json({message:"No thought found with this id!"});
                retuen;
            }
            res.json(dbThoughtData)
        })
        .catch((err) => res.json(err));
    },

    //delete Thought
    deleteThought ({params }, res){
        Thought.findOneAndDelete({_id: params.id})
        .then((dbThoughtData) => {
            if (!dbThoughtData){
                return res.status(404).josn({message: "No thought with this ID"});
            }

            //remove thought id from user's thoughts field
            return User.findOneAndUpdate(
                { thought: params.id}, 
                {$pull: {thoughts: params.id}},
                {new: true}
            );
        })
        .then((dbUserData)=>{
            if (!dbUserData) {
                return res 
                .status (404)
                .json ({message: "Thougth created but there is no user with this ID"});
            }
            res.json({message: "Thought deleted sucessfully"});
        })
        .catch((err) => res.json(err));
    }, 

    //add reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $addToSet: { reactions: body } },
          { new: true, runValidators: true }
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              res.status(404).json({ message: "No thought with this ID" });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch((err) => res.json(err));
      },

    //delete reaction
    removeReaction({ params }, res){
        Thought.findOneAndUpdate(
            {_id: params.thoughtId }, 
            { $pull: {reactions: { reactionId: params.reactionId }}}, 
            {new: true }
        )
        .then((dbThoughtData) => ReturnDocument.json(dbThoughtData))
        .catch ((err) => res.json(err));
    },
};

module.export = thoughtController;