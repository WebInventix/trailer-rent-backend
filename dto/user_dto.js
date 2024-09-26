class User_DTO{
    constructor(user){
        this._id = user._id;
        this.email = user.email;
        this.role = user.role;
        this.status= user.status;
        this.kyc = user.kyc
    }
}

module.exports = User_DTO;