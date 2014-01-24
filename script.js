// ==UserScript==
// @name        Salesforce Developer Menu Enhancement
// @namespace   http://www.salesforce.com
// @description Enhances User menu to include most used options
// @include     https://*.salesforce.com/*
// @include     https://c.*.force.com/*
// @exclude     https://dreamevent.my.salesforce.com/*
// @grant       GM_log
// @version     2.0
// ==/UserScript==
// David Todd
//
// ===============

(function() {
/*function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    //document.body.removeChild(script); // clean up
}

unsafeWindow.addEventListener("load", function() {
    // script injection
    exec(function() {
        // alerts true if you're registered with Stack Overflow
        //alert('UserContext? ' + UserContext.userId);
		//alert(UserContext.userId);
		if (Object.prototype.toString.call(UserContext) === "[object Object]") {*/
		// look for the drop down menu item
			try {
				var menuArea = document.getElementById('userNav-menuItems');
			} catch (e) {}
			if (Object.prototype.toString.call(menuArea) === "[object HTMLDivElement]") {
				var hrelement = document.createElement('hr'),
					sandboxElement = document.getElementsByClassName("pageMsg textOnly normalImportance")[0],
					lastLink,
					menuLinks,
					//userId = UserContext.userId;
					urls = {
						//menuArea: null,
						//lastLink: null,
						//menuLinks: null,
						customObjectIds: [
							['BRC', '01IE00000008voo'],
							['Property', '01IE00000008vop']
						],
						customObjectUrl: '?setupid=CustomObjects',
						newMenuOptions: [
							//['Advanced User Settings', '?noredirect=1'],
							['Apex Classes', '/01p?setupid=ApexClasses'],
							['VisualForce Pages', '/apexpages/setup/listApexPage.apexp?setupid=ApexPages'],
							['Custom Objects', '/p/setup/custent/CustomObjectsPage?setupid=CustomObjects'],
							['Apex Test Execution', '/ui/setup/apex/ApexTestQueuePage?setupid=ApexTestQueue'],
							['Custom Settings', '/setup/ui/listCustomSettings.apexp?setupid=CustomSettings']
						],
						customListUrls: ['_CustomFieldRelatedList_target', '#LayoutList_target', '#CustomResourceLinkList$RelatedIntegrationLinksList_target'],
						// #01IE00000008vop_CustomFieldRelatedList_target
						itemNames: ['Fields', 'Page Layouts', 'Buttons and Links'],
						buttonsUrl: '/p/setup/link/ActionButtonLinkList',
						fieldListUrl: '/p/setup/layout/LayoutFieldList',
						pageLayoutUrl: '/ui/setup/layout/PageLayouts',
						standardObjFields: ['Account', 'BRC', 'Case', 'Contact', 'Lead', 'Opportunity', 'Property', 'Quote'],
						adminMenuOptions: [
							['Users', '/005?setupid=ManageUsers'],
							['Roles', '/ui/setup/user/RoleViewPage?setupid=Roles'],
							['Permission Sets', '/0PS?setupid=PermSets'],
							['Profiles', '/00e?setupid=EnhancedProfiles'],
							['Sharing Settings', '/p/own/OrgSharingDetail?setupid=SecuritySharing'],
							['Field Accessibility', '/setup/layout/flslayoutjump.jsp'],
							['Workflow Rules', '/01Q?&setupid=WorkflowRules'],
							['Approval Processes', '/p/process/ProcessDefinitionSetup?setupid=ApprovalProcesses'],
							['Static Resources', '/apexpages/setup/listStaticResource.apexp?setupid=StaticResources']
						]
					},
					objectListOptions = [
						['-- Choose a List --', ''],
						['Assets', '/02i'],
						['Cross References', '/a0t/o'],
						['Lookup Configs', '/a2q/o'],
						['Packages', '/01t'],
						['Products', '/01t/o'],
						['Product Definitions', '/a32/o'],
						['RateCards', '/a16'],
						['RateCardEntries', '/a15']
					],
					addLineAndHeading = function(heading) {
						var hrelement = document.createElement('hr'),
							element = document.createElement('h2');
						hrelement.setAttribute('class', "divider");
						element.appendChild(document.createTextNode(heading));
						element.setAttribute('style', "padding:5pt");
						menuArea.insertBefore(hrelement, lastLink);
						menuArea.insertBefore(element, lastLink);
					},
					addItemsToList = function(menuOptions, color) {
						var i,
							il = menuOptions.length,
							itemName,
							itemURL,
							newLink;
							//userId = UserContext.userId;
						for (i = 0; i < il; i += 1) {
							itemName = menuOptions[i][0];
							itemURL = menuOptions[i][1];
							/*if(i==0) {
								itemURL = '/' + userId + itemURL;
							}*/

							//GM_log('itemName =' + itemName );

							// Append the link to the links block
							newLink = document.createElement('a');
							newLink.setAttribute('href', itemURL);
							newLink.setAttribute('class', "menuButtonMenuLink");
							newLink.setAttribute('style', "font-style:italic; color:" + color);
							newLink.innerHTML = itemName;
							menuArea.insertBefore(newLink, lastLink);
						}
					},
					createUrls = function(objectName) { // Creates the actual URLs for each object's fields, page layouts, & buttons
						var item1, item2, item3, itemUrl;
						if (objectName === 'BRC' || objectName === 'Property') {
							var baseUrl, objectId;
							if (objectName === 'BRC') {
								objectId = urls.customObjectIds[0][1];
								baseUrl = '/' + urls.customObjectIds[0][1] + urls.customObjectUrl;
							} else if (objectName === 'Property') {
								objectId = urls.customObjectIds[1][1];
								baseUrl = '/' + urls.customObjectIds[1][1] + urls.customObjectUrl;
							}
							item1 = baseUrl + '#' + objectId + urls.customListUrls[0];
							item2 = baseUrl + urls.customListUrls[1];
							item3 = baseUrl + urls.customListUrls[2];
						} else {
							item1 = urls.fieldListUrl + '?type=' + objectName + '&setupid=' + objectName + 'Fields';
							item2 = urls.pageLayoutUrl + '?type=' + objectName + '&setupid=' + objectName + 'Layouts';
							item3 = urls.buttonsUrl + '?pageName=' + objectName + '&type=' + objectName + '&setupid=' + objectName + 'Links';
						}
						itemUrl = [
							[urls.itemNames[0], item1],
							[urls.itemNames[1], item2],
							[urls.itemNames[2], item3]
						];
						return itemUrl;
					},
					createSelectList = function() { // creates links in a select list
						var select = document.createElement("select"),
						i,
						il = objectListOptions.length;
						select.setAttribute("name", "mySelect");
						select.setAttribute("id", "mySelect");
						select.setAttribute("onchange", "location = this.options[this.selectedIndex].value")
						select.setAttribute('style', "width:150px; margin-left:5px");
						/* setting an onchange event */
						//select.onchange = function() {dbrOptionChange()};
						
						for (i = 0; i < il; i += 1) {
							var option;
							option = document.createElement("option");
							option.setAttribute("value", objectListOptions[i][1]);
							option.innerHTML = objectListOptions[i][0];
							select.appendChild(option);
						}
						menuArea.insertBefore(select, lastLink);
					},
					addFieldLinks = function() { // creates each object section
						var i,
						il = urls.standardObjFields.length,
							element,
							items;
						menuArea.insertBefore(document.createElement('br'), lastLink);
						for (i = 0; i < il; i += 1) {
							var j,
							l,
							newLink;
							element = document.createElement('label');
							element.appendChild(document.createTextNode(urls.standardObjFields[i]));
							element.setAttribute('style', "font-style:italic; color:black; margin-left:5px");
							menuArea.insertBefore(element, lastLink);
							items = createUrls(urls.standardObjFields[i]);

							//GM_log('itemName =' + this.standardObjFields[i] );

							l = items.length;
							for (j = 0; j < l; j += 1) {
								// Append the link to the links block
								newLink = document.createElement('a');
								newLink.setAttribute('href', items[j][1]);
								newLink.setAttribute('class', "menuButtonMenuLink");
								newLink.innerHTML = items[j][0];
								newLink.setAttribute('style', "font-style:italic; color:red; margin-left:10px");
								menuArea.insertBefore(newLink, lastLink);
							}
						}
					};
				// sandbox only; ignore production instance
				if (Object.prototype.toString.call(sandboxElement) === "[object HTMLSpanElement]") {
					var url = window.location.hostname,
						mruItems = document.getElementsByClassName("mruItem"),
						getColor = {
							colors: ['192, 23, 0', '255, 119, 0', '23, 192, 37', '192, 23, 178', '64, 23, 192']
							// return colors[index];
							// return colors[Math.floor((Math.random()*5)+1)];
						},
						baseName = url.split(".", 1).toString(),
						sandboxType = function () {
							if(baseName.indexOf('uat') > -1) {return 1}
							else if(baseName.indexOf('qa') > -1) {return 2}
							else if((baseName.indexOf('dev') > -1) || (baseName.indexOf('sprint') > -1)) {return 3}
							else {return 4}
						},
						color, i;
					switch (sandboxType()) {
						case 1:
							color = getColor.colors[0]; // dark red
							break;
						case 2:
							color = getColor.colors[1]; // orange
							break;
						case 3:
							color = getColor.colors[2]; // green
							break;
						case 4:
							color = getColor.colors[3]; // pink/purple
							break;
						default:
							color = getColor.colors[4]; // dark blue
							break;
					}
					//alert(color + "\n" + baseName);
					sandboxElement.setAttribute("style", "position:fixed;z-index:1;left:25px");
					document.getElementById("phHeader").setAttribute("style", "background-color:rgb(" + color + ")");
					//GM_log('mruItems.length=' + mruItems.length);
					if (mruItems.length > 0) {
						for (i = 0; i < mruItems.length; i += 1) {
							mruItems[i].setAttribute("style", "z-index:0");
						}
					}
				}
				hrelement.setAttribute('class', "divider");
				menuLinks = menuArea.getElementsByTagName("a");
				lastLink = menuLinks[menuLinks.length - 1];

				//GM_log('menuLinks.length=' + this.menuLinks.length );
				//alert(UserContext.userId);
				createSelectList();
				// Create a separator and heading in the menu list
				addLineAndHeading('Developer Tools');
				
				// Add links to the list
				addItemsToList(urls.newMenuOptions, 'green');

				// Create a separator and heading in the menu list
				addLineAndHeading('Admin Tools');

				// Add links to the list
				addItemsToList(urls.adminMenuOptions, 'blue');

				// Create a separator and heading in the menu list
				addLineAndHeading('Fields & Layouts');

				// Add Standard Obj Fields
				addFieldLinks();

				// Create a separator in the menu list
				//newLink = document.createElement('hr');
				menuArea.insertBefore(hrelement, lastLink);

			}
/*		}
    });
}, false);*/
}());