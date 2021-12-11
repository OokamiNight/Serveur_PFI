module.exports = 
class New{
    constructor(title, text, created, userID, newsGUID)
    {
        this.Id = 0;
        this.Title = title !== undefined ? title : "";
        this.Text = text !== undefined ? text : "";
        this.Created = created !== undefined ? created : 0;
        this.UserID = userID !== undefined ? userID : 0;
        this.NewsGUID = newsGUID !== undefined ? newsGUID : "";
    }

    static valid(instance) {
        const Validator = new require('./validator');
        let validator = new Validator();
        validator.addField('Id','integer');
        validator.addField('Title','string');
        validator.addField('Text','string');
        validator.addField('Created','integer');
        validator.addField('UserID', 'integer');
        return validator.test(instance);
    }
}