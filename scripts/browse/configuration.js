 FAOSTATOLAPV3={};
FAOSTATOLAPV3.grouped=true;
var dataTest2=[];
var matchMonth = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06","Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
function changechkTreeview(){
   FAOSTATOLAPV3.grouped=document.getElementById('chkTreeview').checked;
   FAOSTATOLAPV3.mygrid="";
$("#fx-olap-ui").pivotUI(FAOSTATNEWOLAP.originalData,FAOSTATOLAP2.options.E,false);}

function newGrid(r){
var r2d2=[];
$("#mesFlags").empty();
if(r.colKeys.length>0){
    for(ligne in r.tree){
        var temp=ligne.split('||');
        for(col in r.colKeys){
        var coldInd=r.colKeys[col].join("||");//.replace(/[^a-zA-Z0-9 ]/g,"_");
        if( r.tree[ligne][coldInd]!=null){ temp.push(r.tree[ligne][coldInd].value()); }
        else{temp.push( "");}
//temp.push(r.rowTotals[ligne].sum);
                // r2d2.push([ligne,col,+r.tree[ligne][col].value()]);
      }
      r2d2.push(temp);
     }
}
else{
     for(ligne in r.rowTotals){
          var temp=ligne.split('||');
          if( r.rowTotals[ligne]!=null){
              temp.push(r.rowTotals[ligne].value());}
            else{temp.push( "");}
      r2d2.push(temp);
     }
}
var grid_demo_id = "myGrid1" ;
var dsOption= {
    fields :[],
    recordType : 'array',
    data : r2d2
};
var colsOption = [];
for(var i in r.rowAttrs){

   dsOption.fields.push({name : r.rowAttrs[i]  });
   colsOption.push({id:  r.rowAttrs[i] , header:  r.rowAttrs[i] , frozen : true ,grouped : FAOSTATOLAPV3.grouped});
   
}
var reg = new RegExp("<span class=\"ordre\">[0-9]*</span>(.*)", "g"); 
var reg2 = new RegExp("<span class=\"ordre\">[0-9]*</span><table class=\"innerCol\"><th>([0-9]+)</th><th>([^>]*)</th></table>", "g"); 

if(r.colKeys.length>0){
for(var i in r.colKeys){
   dsOption.fields.push({name : r.colKeys[i].toString().replace(/[^a-zA-Z0-9]/g,"_")  } );
   montitle="";
   for(var ii=0;ii<r.colKeys[i].length;ii++){
      
      montitle+="<br />"+r.colKeys[i][ii].replace(reg, "$1");
   }
   colsOption.push({id:  r.colKeys[i].join("_").replace(/[^a-zA-Z0-9]/g,"_") ,
       header: montitle, toolTip : true ,toolTipWidth : 150
	   ,     renderer:my_renderer
	   });
    }
}
else{ dsOption.fields.push({name : "Value"  } );
     colsOption.push({id: "Value" ,
       header: "Value", toolTip : true ,toolTipWidth : 150
	   ,       renderer:my_renderer
	   });
    }

Sigma.ToolFactroy.register(
	'mybutton',  {cls : 'mybutton-cls', toolTip : 'I am a new button',
            action : function(event,grid) {  alert( 'The id of this grid is  '+grid.id)  }
	}
);


function my_renderer(value ,record,columnObj,grid,colNo,rowNo){
    var no="";    
    if(record[columnObj.fieldIndex].length>1){
    no= "<table class=tableVCell><tr><td>"+addCommas(record[columnObj.fieldIndex][0])+"</td>";/*
    if(F3DWLD.CONFIG.wdsPayload.showUnits){no+= "<td>"+record[columnObj.fieldIndex][1]+"</td>";}
       if(F3DWLD.CONFIG.wdsPayload.showFlags){no+= "<td>"+  record[columnObj.fieldIndex][2]+"</td>";}*/
        no+="</tr></table>";
    }
    else{
        //    no=record[columnObj.fieldIndex].toLocaleString();
        no=addCommas(record[columnObj.fieldIndex]);
        }
    return no;
}

var gridOption={
	id : grid_demo_id,
	width: "800",  //"100%", // 700,
	height: "350",  //"100%", // 330,
	container :"myGrid1_div",//pvtRendererArea",//testinline2",//'',//myGrid1_div',//pivot_table',// 'gridbox',// $(".pvtRendererArea")[0],//
	replaceContainer : true, 
	dataset : dsOption ,
        resizable : false,
	columns : colsOption,
	pageSize : 50 ,
        pageSizeList : [50,150,500],
        SigmaGridPath : 'grid/',
      
	toolbarContent : 'nav | goto | pagesize '/*,*//*| mybutton |*/
        /*
onMouseOver : function(value,  record,  cell,  row,  colNo, rowNo,  columnObj,  grid){
    if (columnObj && columnObj.toolTip) { grid.showCellToolTip(cell,columnObj.toolTipWidth);}
    else{grid.hideCellToolTip();}
	},
	onMouseOut : function(value,  record,  cell,  row,  colNo, rowNo,  columnObj,  grid){grid.hideCellToolTip();}*/
};

  FAOSTATOLAPV3.mygrid=new Sigma.Grid( gridOption );
 Sigma.Grid.render( FAOSTATOLAPV3.mygrid)() ;
 document.getElementById('page_after').innerHTML="/"+FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;
  FAOSTATOLAPV3.mygrid.pageSizeSelect.onchange=function()
  {document.getElementById('page_after').innerHTML="/"+FAOSTATOLAPV3.mygrid.getPageInfo().totalPageNum;};
 
 if(FAOSTATOLAPV3.grouped){$("#mesFlags").append($("<label for=\"chkTreeview\">Treeview/sorting columns</label><input checked onchange=\"changechkTreeview()\" type=\"checkbox\" id=\"chkTreeview\">"));}
else{$("#mesFlags").append($("<label for=\"chkTreeview\">Treeview/Sorting columns</label><input  onchange=\"changechkTreeview()\" type=\"checkbox\" id=\"chkTreeview\">"));}
$("#nested_by").hide();
}

		