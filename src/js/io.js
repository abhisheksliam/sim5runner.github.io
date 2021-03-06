/**
 * Created by AbhishekK on 2/2/2016.
 */

updateCurrentTreeNode = function(){
    // get and update from breadcrum
    var currentScenarioLSM =   localStorage.getItem('currentScenario');
    if(currentScenarioLSM){currentScenario = currentScenarioLSM};

    var currentItemNumberLSM = JSON.parse(localStorage.getItem('currentItemNumber'));
    if(currentItemNumberLSM){currentItemNumber = parseInt(currentItemNumberLSM)};

    var currentMethodNumberLSM = JSON.parse(localStorage.getItem('currentMethodNumber'));
    if(currentMethodNumberLSM){currentMethodNumber = parseInt(currentMethodNumberLSM)};

    var currentActionNumberLSM = JSON.parse(localStorage.getItem('currentActionNumber'));
    if(currentActionNumberLSM){currentActionNumber = parseInt(currentActionNumberLSM)};

    taskData =   JSON.parse(localStorage.getItem('taskData'));
};


function addValue(obj, key, index, value) {
    if (obj.hasOwnProperty(key)) {

        if(obj[key[index]]){
            obj[key[index]].push(value);
        }else{
            obj[key][index] = value;
        }
    } else {
        obj[key] = [value];
    }
};

var taskData = {
    init: false,
    scenario: '',
    id: '',
    name:'',
    description: '',
    appName:'',
    items:[
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        }
    ]
};

var currentMethodDetails = {
    init: false,
    type:'',
    actions:[]
};

var currentActionDetails = {
    init: 'false',
    name: '',
    values: []
};

var taskDataRaw = {
    init: false,
    scenario: '',
    id: '',
    name:'',
    description: '',
    appName:'',
    items:[
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        },
        {
            init:false,
            skip:false,
            methods:[]
        }
    ]
};

(function initLSM(){

    taskData =   JSON.parse(localStorage.getItem('taskData'));

    if(!taskData){
        localStorage.setItem('taskData', JSON.stringify(taskDataRaw));
    }

})();

resetLSM = function(){

    localStorage.setItem('taskData', JSON.stringify(taskDataRaw));
    updateCurrentTreeNode();

    localStorage.setItem('currentItemNumber', JSON.stringify(1));
    localStorage.setItem('currentMethodNumber', JSON.stringify(1));
    localStorage.setItem('currentActionNumber', JSON.stringify(1));
    localStorage.setItem('currentScenario', 'T1');
    currentMethodDetails = {
        init: false,
        type:'',
        actions:[]
    };

    currentActionDetails = {
        init: 'false',
        name: '',
        values: []
    };

    localStorage.setItem('pathwayListData', '');

};


var initCurrentTaskData = function(callback){

    taskData.scenario = currentScenario;
    taskData.id = ($('#inputTaskId').val()).replace(/ /g,'');
    taskData.name = $('#inputTaskName').val();
    taskData.description = $('#taskDescription').val();
    taskData.init = true;

    var appName = '';

    if((taskData.id.toLowerCase()).indexOf('.xl') != -1){
        appName = 'excel';
    }
    else if((taskData.id.toLowerCase()).indexOf('.pp') != -1){
        appName = 'ppt';
    }
    else if((taskData.id.toLowerCase()).indexOf('.ac') != -1){
        appName = 'access';
    }
    else if((taskData.id.toLowerCase()).indexOf('.wd') != -1){
        appName = 'word';
    }

    var userAppType = JSON.parse(localStorage.getItem('userAppType'));
    if(userAppType.toUpperCase() === appName.toUpperCase()){

        taskData.appName = appName;

        console.log('console.log(taskData.name) ' + taskData.name);
        localStorage.setItem('taskData', JSON.stringify(taskData));
        callback();

    }else{
        alert('Incorrect Task Id or selected App Type');
    }
};

var saveTaskData = function(){
    initCurrentTaskData(function(){

        taskData =   JSON.parse(localStorage.getItem('taskData'));
        console.log('console.log(taskData.name) 2 ' + taskData);

    });
};

var initCurrentMethodData = function(callback){


        var rr1 = [];
        $('#method-type :selected').each(function(i, selected){
            rr1[i] = $(selected).text();
        });
    var methodType =  rr1.toString();

    currentMethodDetails = {
        init: false,
        type:'',
        actions:[]
    };

    if(taskData.init){

        currentMethodDetails.type = methodType;
        currentMethodDetails.init = true;

        console.log('currentItemNumber' + currentItemNumber);
        console.log('currentMethodNumber' + currentMethodNumber);

        try{
            if(taskData.items[parseInt(currentItemNumber) - 1].methods[(parseInt(currentMethodNumber)-1)].init){

                taskData.items[parseInt(currentItemNumber) - 1].methods[(parseInt(currentMethodNumber)-1)].type  = methodType;
				
				$('.item-node').eq(parseInt(currentItemNumber) - 1).find('.method-node').eq((parseInt(currentMethodNumber)-1)).find('.method-type').html("(" + methodType + ")");

            }
        }catch(er){
            taskData.items[parseInt(currentItemNumber) - 1].init = true;
            addValue(taskData.items[parseInt(currentItemNumber)-1],'methods', (parseInt(currentMethodNumber)-1) ,currentMethodDetails);
			$('.item-node').eq(parseInt(currentItemNumber) - 1).find('.method-node').eq((parseInt(currentMethodNumber)-1)).find('.method-type').html("(" + currentMethodDetails.type + ")");
        }

        localStorage.setItem('taskData', JSON.stringify(taskData));
    }
    else{
        alert('Enter Task Data First')
    }
    callback();

};

var saveMethodData = function(){
// validate if taskdata init

    initCurrentMethodData(function(){

        taskData =   JSON.parse(localStorage.getItem('taskData'));
        console.log('console.log(taskData.name ' + taskData);

    });

};

var initCurrentActionData = function(callback){

    var actionDetailsForm = $('#actionDetailsForm');

    currentActionDetails = {
        init: 'false',
        name: '',
        values: [],
		balooActionIndex: ''
    };

    if((taskData.items[parseInt(currentItemNumber)-1].methods[parseInt(currentMethodNumber)-1]) && (taskData.items[parseInt(currentItemNumber)-1].methods[parseInt(currentMethodNumber)-1].init)) {

            currentActionDetails.name = $('.functionDisplayName').attr('name');
            currentActionDetails.syntax = $('.functionDisplayName').text().trim();
            currentActionDetails.init = true;

            // update tree view
	        $('.item-node').eq(currentItemNumber-1).find('.method-node').eq(currentMethodNumber -1).find('.action-node').eq(currentActionNumber -1).find('.action-name').html(currentActionDetails.name);
		
		if((taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[currentActionNumber -1]) && (taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[currentActionNumber -1].balooActionIndex !== undefined)) {
			currentActionDetails.balooActionIndex = taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[currentActionNumber -1].balooActionIndex
		}

            if($( "#actionDetailsForm input").length){

                $( "#actionDetailsForm input" ).each(function( index ) {

                    var actKey = $( this).attr('id');
                    var actVal = $( this).val();
                    var localActionValue = { actKey : actKey, actVal : actVal}
                    addValue(currentActionDetails,'values',index, localActionValue);

                    console.log( index + ": " +$( this).attr('id') + ' : ' + $( this).val() );
                });
            }
            addValue(taskData.items[parseInt(currentItemNumber)-1].methods[parseInt(currentMethodNumber)-1],'actions', (parseInt(currentActionNumber)-1) ,currentActionDetails);

            localStorage.setItem('taskData', JSON.stringify(taskData));
    } else {
        alert('Enter Method Data First')
    }

    callback();

};

var saveActionData = function(){
// validate if method data init

    initCurrentActionData(function(){

        taskData =   JSON.parse(localStorage.getItem('taskData'));
        console.log('console.log(taskData.name) ' + taskData);
		
		renderBalooAction('action');
    });

};

/**
 * save task data to lsm
 */

$( "#saveTaskDetails" ).click(function() {
    $( this).append('<i style="padding: 0px 10px " class="fa fa-refresh fa-spin"></i>');

    updateCurrentTreeNode();
    saveTaskData();

    var self = this;
    setTimeout(function() {
        $( self).find('.fa-refresh').remove()
    }, 500);

});

$( "#saveMethodDetails" ).click(function() {
    $( this).append('<i style="padding: 0px 10px " class="fa fa-refresh fa-spin"></i>');

    updateCurrentTreeNode();
    saveMethodData();

    var self = this;
    setTimeout(function() {
        $( self).find('.fa-refresh').remove()
    }, 500);
});

$( "#saveActionDetails" ).click(function() {
    $( this).append('<i style="padding: 0px 10px " class="fa fa-refresh fa-spin"></i>');

    updateCurrentTreeNode();
    saveActionData();

    var self = this;
    setTimeout(function() {
        $( self).find('.fa-refresh').remove()
    }, 500);
});


$( "#exportXMLTop" ).click(function() {
    taskData =   localStorage.getItem('taskData');
    console.log('taskData.name: ' , taskData);
});


$( "#resetLSM" ).click(function() {
    resetLSM();
    initactionList();
    window.location.reload(true);
});


