class AddProject{
    static projectTitle = document.getElementById("project-title-input-id");
    static projectDetails = document.getElementById("project-details-input-id");
    static addProjectButton = document.getElementById("add-project-button-id");
    static projectDate = document.getElementById("project-date-input-id");
    static projectTime = document.getElementById("project-time-input-id");

    static setCurrentProjectsList(currentProjectsList){
        this.currentProjectsList = currentProjectsList;
    }

    static generateId(){
        this.id = Math.floor((Math.random()*10000)).toString();
        for(let i=0;i<4;i++){
            let text = String.fromCharCode(65 + Math.floor((Math.random()*26)));
            this.id += text;
        }
        return this.id;
    }

    static getTime(){
        const date = new Date();
        const hour = date.getHours().toString().length > 1 ? date.getHours() : "0"+date.getHours();
        const minute = date.getMinutes().toString().length > 1 ? date.getMinutes() : "0"+date.getMinutes();
        return hour+":"+minute;
    }

    static getDate(){
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth()+1).toString().length > 1 ? (date.getMonth()+1) : "0"+(date.getMonth()+1);
        const day = date.getUTCDate().toString().length > 1 ? date.getUTCDate() : "0"+date.getUTCDate();
        return year+"-"+month+"-"+day;
    }

    static addProjectToCurrentList(){
        this.currentProjectsList.projects.push(
                                                new ProjectItem(this.generateId(), 
                                                                this.projectTitle.value, 
                                                                this.projectDetails.value, 
                                                                this.getDate(),
                                                                this.getTime(),
                                                                this.projectDate.value,
                                                                this.projectTime.value, 
                                                                "current")
                                                );

        this.projectTitle.value = '';
        this.projectDetails.value = '';
        this.currentProjectsList.render();
    }

    static addProject(){
        this.addProjectButton.addEventListener("click", this.addProjectToCurrentList.bind(this));
    }
}

class ProjectItem{
    static list;
    constructor(
                projectId, 
                projectTitle, 
                projectDetails, 
                projectStartTime, 
                projectStartDate, 
                projectDeadlineDate, 
                projectDeadlineTime, 
                type
            ){

        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.projectDetails = projectDetails;
        this.startTime = projectStartTime;
        this.startDate = projectStartDate;
        this.deadlineDate = projectDeadlineDate;
        this.deadlineTime = projectDeadlineTime;
        this.type = type;
        this.renderedItem = this.render();
        this.switchProject();
        this.deleteProject();
        this.moreInfo();
    }

    render(){
        const projectItem = document.createElement("li");
        projectItem.innerHTML = `
            <h3>${this.projectTitle}</h3>
            <p>${this.projectDetails}</p>
            <div class="invisible">
                <div class="more-info">
                    <h3>Start:</h3>
                    <h3 class="start">${this.startTime}</h3>
                    <h3 class="start">${this.startDate}</h3>
                </div>
                <div class="more-info">
                    <h3>Deadline:</h3>
                    <h3 class="deadline">${this.deadlineDate}</h3>
                    <h3 class="deadline">${this.deadlineTime}</h3>
            </div>
            </div>
            <button class="alt">More Info</button>
            <button class="alt" id="type-id">Finish</button>
            <button>Delete</button>
        `;
        projectItem.classList.add("project-card");
        return projectItem;
    }

    showMoreInfo(){
        this.renderedItem.children[2].classList.toggle("invisible");
    }

    moreInfo(){
        this.renderedItem.children[3].addEventListener("click", this.showMoreInfo.bind(this));
    }


    static setLists(currentProjectsList, finishedProjectsList){
        this.currentProjectsList = currentProjectsList;
        this.finishedProjectsList = finishedProjectsList;
    }

    getlistInUse(){
        if(this.type === "current"){
            this.list = ProjectItem.currentProjectsList;
        }else{
            this.list = ProjectItem.finishedProjectsList;
        }
    }

    switchProjectList(){
            this.getlistInUse();
            this.list.switchProjectList(this.projectId);
    }

    switchProject(){
        this.renderedItem.children[4].addEventListener("click", this.switchProjectList.bind(this));
    }


    deleteProjectFromList(){
        this.getlistInUse();
        this.list.deleteProject(this.projectId);
    }

    deleteProject(){
        this.renderedItem.children[5].addEventListener("click", this.deleteProjectFromList.bind(this));
    }

}

class ProjectList{
    constructor(type){
        this.projects = [];
        this.type = type;

    }

    render(){
        this.renderedProjectList = document.getElementById(`${this.type}-projects-list-id`);

        for(let projectItem of this.projects){
            projectItem.renderedItem.children[4].innerText = this.type === 'current'? 'Finish' : 'Activate';
            this.renderedProjectList.append(projectItem.renderedItem);
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction) {
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project){
        project.type = this.type;
        this.projects.push(project);
        this.render();
    }

    switchProjectList(projectId){
        this.switchHandler(this.projects.find(p => p.projectId === projectId));
        this.projects = this.projects.filter(p => p.projectId !== projectId);
    }

    deleteProject(projectId){
        const project = this.projects.find(p => p.projectId === projectId);
        this.projects = this.projects.filter(p => p.projectId !== projectId);
        project.renderedItem.remove();
    }

}

class App{
    static init(){
        const currentProjects = new ProjectList("current");
        const finishedProjects = new ProjectList("finished");
        AddProject.setCurrentProjectsList(currentProjects);
        AddProject.addProject();
        currentProjects.setSwitchHandlerFunction(finishedProjects.addProject.bind(finishedProjects));
        finishedProjects.setSwitchHandlerFunction(currentProjects.addProject.bind(currentProjects));
        ProjectItem.setLists(currentProjects, finishedProjects);
    }
}

App.init();
