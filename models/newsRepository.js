const Repository = require('./repository');
const ImageFilesRepository = require('./imageFilesRepository.js');
const News = require('./new.js');
const utilities = require("../utilities");
module.exports = 
class NewsRepository extends Repository {
    constructor(req){
        super('News', true);
        this.users = new Repository('Users');
        this.images = new Repository('Images');
        this.req = req;

    }
    bindOneNews(news){
        if (news) {    
            let bindedNews = {...news};

            let user = this.users.get(news.UserID); 
            let username = "unknown";
            if (user !== null)
                username = user.Name;
            bindedNews["Username"] = username;
            
            if (user["AvatarGUID"] != "")
                bindedNews["AvatarURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(user["AvatarGUID"]);

            if (news["GUID"] != ""){
                bindedNews["OriginalURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getImageFileURL(news["GUID"]);
                bindedNews["ThumbnailURL"] = "http://" + this.req.headers["host"] + ImageFilesRepository.getThumbnailFileURL(news["GUID"]);
            } else {
                bindedNews["OriginalURL"] = "";
                bindedNews["ThumbnailURL"] = "";
            }
            return bindedNews;
        }
        return null;
    }
    bindNews(images){
        let bindedNews = [];
        for(let image of images) {
            bindedNews.push(this.bindOneNews(image));
        };
        return bindedNews;
    }

    get(id) {
        return this.bindOneNews(super.get(id));
    }
    getAll(params) {
        return this.bindNews(super.getAll(params));
    }
    add(news) {
        news["Created"] = utilities.nowInSeconds();
        if (News.valid(news)) {
            news["GUID"] = ImageFilesRepository.storeImageData("", news["ImageData"]);
            delete news["ImageData"];
            return this.bindOneNews(super.add(news));
        }
        return null;
    }
    update(news) {
        news["Created"] = utilities.nowInSeconds();
        if (News.valid(news)) {
            let foundNews = super.get(news.Id);
            if (foundNews != null) {
                news["GUID"] = ImageFilesRepository.storeImageData(news["GUID"], news["ImageData"]);
                delete news["ImageData"];
                return super.update(news);
            }
        }
        return false;
    }    
    remove(id){
        let foundNews = super.get(id);
        if (foundNews) {
            ImageFilesRepository.removeImageFile(foundNews["GUID"]);
            return super.remove(id);
        }
        return false;
    }
}