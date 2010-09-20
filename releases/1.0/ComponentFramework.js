/**
 * HTML Component Framework.
 *
 * Copyright (c) 2010, Joel Laird
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of Joel Laird nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 Component();function Component(){var constructorDefinition=new Object();var acceptableEvents=new Object();var raisableEvents=new Object();var listenersRegisteredForEvent=new Object();var component;var origin;var componentId;Component.render=function(){jQuery("body").addClass("cf_loading");loadMetaData("constructor",constructorDefinition);var response=validateConstructorParameters();if(response.valid){loadMetaData("acceptsEvent",acceptableEvents);loadMetaData("raisesEvent",raisableEvents);var classNameHierarchy=getClassNameHierarchy();ComponentFactory.loadAndRender(classNameHierarchy);var constructorParameterString=createSignatureParamString("response.constructorParameters",constructorDefinition.properties);var className=classNameHierarchy[classNameHierarchy.length-1];eval("if (typeof("+className+') != "undefined") component = new '+className+constructorParameterString+";");if(typeof(component)!="undefined"){var originSearch=/.*origin=([^&]*)/.exec(location.search);if(originSearch!=null){origin=unescape(originSearch[1])}var componentIdSearch=/.*id=([^&]*)/.exec(location.search);if(componentIdSearch!=null){componentId=unescape(componentIdSearch[1])}response=registerAcceptableEvents(component);if(!response.success){logErrors(response.errors)}Event.informParentOfEventUrl(componentId)}}else{logErrors(response.errors)}jQuery("body").removeClass("cf_loading")};Component.fireEvent=function(eventOrigin,eventNameJSON,eventPropertiesJSON){if(origin==eventOrigin){var eventName=JSON.parse(eventNameJSON);var eventProperties=JSON.parse(eventPropertiesJSON);if(typeof(acceptableEvents[eventName])!="undefined"){var response=JSONSchema.validate(eventProperties,acceptableEvents[eventName]);if(response.valid){acceptableEvents[eventName].componentReference(eventProperties)}}}};Component.informOfListenerRegistration=function(eventOrigin,eventNameJSON){if(origin==eventOrigin){var eventName=JSON.parse(eventNameJSON);if(typeof(raisableEvents[eventName])!="undefined"){listenersRegisteredForEvent[eventName]=true}}};Component.raiseEvent=function(eventName,eventProperties){if(typeof(raisableEvents[eventName])!="undefined"&&listenersRegisteredForEvent[eventName]){Event.raise(componentId,eventName,eventProperties)}};function loadMetaData(metaName,metaObject){jQuery('meta[name="'+metaName+'"]').each(function(){var metaElement=JSON.parse(this.content);for(var metaItemName in metaElement){metaObject[metaItemName]=metaElement[metaItemName]}})}function getClassNameHierarchy(){var className=/\/([^\/\.]+)\.[^\/]+$/.exec(location.pathname)[1];var classNameHierarchy;var parentClassNamesMatch=/.*parentClassNames=([^&]*)/.exec(location.search);if(parentClassNamesMatch==null||parentClassNamesMatch.length<2){classNameHierarchy=new Array()}else{classNameHierarchy=unescape(parentClassNamesMatch[1]).split(",")}classNameHierarchy[classNameHierarchy.length]=className;return classNameHierarchy}function validateConstructorParameters(){var jsonConstructorParams;var constructorParametersMatch=/.*parameters=([^&]*)/.exec(location.search);if(constructorParametersMatch==null||constructorParametersMatch.length<2||typeof(constructorDefinition.properties)=="undefined"){return JSON.parse('{"valid": true, "constructorParameters": {}}')}else{jsonConstructorParams=unescape(constructorParametersMatch[1])}var constructorParameters=JSON.parse(jsonConstructorParams);for(var constructorParameterName in constructorParameters){var paramInfo=constructorDefinition.properties[constructorParameterName];if(typeof(paramInfo)=="undefined"){delete constructorParameters[constructorParameterName]}}var response=JSONSchema.validate(constructorParameters,constructorDefinition);response.constructorParameters=constructorParameters;return response}function registerAcceptableEvents(component){var response=new Object();response.success=true;response.errors=new Array();for(var eventName in acceptableEvents){if(typeof(component[eventName])!="undefined"){var parameterString=createSignatureParamString("parameters",acceptableEvents[eventName].properties);var componentReference;eval("componentReference = function(parameters){component."+eventName+parameterString+";}");acceptableEvents[eventName].componentReference=componentReference}else{delete acceptableEvents[eventName];response.success=false;var error=new Object();error.property=eventName;error.message="The event has not been defined on the component.";response.errors[response.errors.length]=error}}return response}function createSignatureParamString(signatureParametersObjectName,expectedParameters){var paramString="(";for(var parameterName in expectedParameters){paramString+=signatureParametersObjectName+"."+parameterName+","}if(paramString.length>1){paramString=paramString.substring(0,paramString.length-1)}paramString+=")";return paramString}function logErrors(errors){jQuery("body").html("");jQuery("body").addClass("cf_error_construction");var errorHtml='<div class="cf_error_construction">';for(var index=0;index<errors.length;index++){errorHtml+='<div class="error">'+errors[index].property+" "+errors[index].message+"</div>"}errorHtml+="</div>";jQuery("body").append(errorHtml)}}var componentMeta=jQuery('meta[name="HTMLComponent"]')[0];var isComponent=typeof(componentMeta)!="undefined";if(isComponent){window.onload=function(){Component.render()}};ComponentFactory();function ComponentFactory(){var componentClassNameMap=new Object();var pageComponentMap=new Object();var lastComponentIFrameIDNum=0;ComponentFactory.loadAndRender=function(parentClassNames){loadClasses();renderComponents(parentClassNames)};ComponentFactory.getPageComponent=function(pageComponentId){return pageComponentMap[pageComponentId]};ComponentFactory.getComponentClassMeta=function(pageComponentFriendlyClassName){return componentClassNameMap[pageComponentFriendlyClassName]};ComponentFactory.newComponent=function(componentId,friendlyClassName,parameters,loadedCallback){var componentClassMeta=componentClassNameMap[friendlyClassName];if(typeof(pageComponentMap[componentId])=="undefined"&&typeof(componentClassMeta)!="undefined"){return createComponent(componentId,friendlyClassName,componentClassMeta,parameters,new Array(),loadedCallback)}else{return null}};ComponentFactory.loadComponentClassMeta=function(friendlyClassName,url){addClassMeta(friendlyClassName,url)};ComponentFactory.removeComponent=function(componentId){var pageComponent=pageComponentMap[componentId];delete pageComponentMap[componentId];delete pageComponent};function loadClasses(){jQuery('meta[name="includeComponent"]').each(function(){var definition=JSON.parse(this.content);addClassMeta(definition.name,definition.url)})}function addClassMeta(name,url){var classMeta=new Object();classMeta.friendlyName=name;classMeta.url=url;var originSearch=/(http(s)?:\/\/.*?)\//.exec(url);classMeta.origin=originSearch!=null?originSearch[1]:location.protocol+"//"+location.host;if(typeof(componentClassNameMap[classMeta.friendlyName])=="undefined"){componentClassNameMap[classMeta.friendlyName]=classMeta}}function renderComponents(parentClassNames){if(typeof(parentClassNames)=="undefined"){parentClassNames=new Array()}jQuery("div.cf_component_marker").each(function(index){var componentClass=componentClassNameMap[this.title];if(typeof(componentClass)=="undefined"){return}var componentElement=jQuery(this);var parameters=new Object();var loadedCallback;componentElement.find("input").each(function(){if(this.name=="loadedCallback"){loadedCallback=eval(this.value)}else{if(/^[{\[].*[}\]]$/.test(this.value)){parameters[this.name]=JSON.parse(this.value)}else{parameters[this.name]=this.value}}});if(hierarchyCheck(componentClass,parentClassNames)){componentElement.append(createComponent(this.id,this.title,componentClass,parameters,parentClassNames,loadedCallback).getElement())}else{componentElement.addClass("cf_error_infinite_recursion")}})}function hierarchyCheck(componentClass,parentClassNames){var retVal=true;var className=/([^\/\.]+)\.[^\/]+$/.exec(componentClass.url)[1];for(var index in parentClassNames){if(className==parentClassNames[index]){retVal=false;break}}return retVal}function createComponent(componentId,friendlyClassName,componentClassMeta,parameters,parentClassNames,loadedCallback){var iFrameName="cf_iframe"+lastComponentIFrameIDNum++;var newElement=document.createElement("iframe");newElement.id=iFrameName;newElement.src=componentClassMeta.url+"?parameters="+escape(JSON.stringify(parameters))+"&parentClassNames="+escape(parentClassNames.join(","))+"&origin="+escape(location.protocol)+"//"+escape(location.host)+"&id="+escape(componentId)+(Event.getEventUrl()!=undefined?"&parentEventUrl="+escape(Event.getEventUrl()):"");newElement.frameBorder="0";newElement.className="cf_iframe";newElement.allowTransparency="true";var pageComponent=new Object();pageComponent.id=componentId;pageComponent.componentIFrame=newElement;pageComponent.friendlyClassName=friendlyClassName;pageComponent.loaded=false;pageComponent.getElement=function(self){return function(){return self.componentIFrame}}(pageComponent);pageComponentMap[componentId]=pageComponent;Event.registerFireEventFunctionality(pageComponent);Event.registerAddEventListenerFunctionality(pageComponent,loadedCallback);return pageComponent}};ComponentFramework();function ComponentFramework(){ComponentFramework.loadAndRender=function(){ComponentFactory.loadAndRender()};ComponentFramework.includeComponent=function(b,a){ComponentFactory.loadComponentClassMeta(b,a)};ComponentFramework.getComponent=function(a){return ComponentFactory.getPageComponent(a)};ComponentFramework.newComponent=function(b,d,c,a){return ComponentFactory.newComponent(b,d,c,a)};ComponentFramework.raiseEvent=function(b,a){Component.raiseEvent(b,a)};ComponentFramework.removeComponent=function(a){ComponentFactory.removeComponent(a)}};Event();function Event(){var d=null;var h=null;var i;var e=new Object();Event.REGISTER_CHILD_EVENT_URL="registerChildEventUrl";Event.ADD_EVENT_LISTENER="addEventListener";Event.COMPONENT_LOADED_EVENT_NAME="componentLoaded";Event.types={FIRE:0,RAISE:1,INFORM_OF_LISTENER_REGISTRATION:2};Event.registerFireEventFunctionality=function(m){m.fireEvent=function(p,n){var o=typeof(m.componentIFrame.contentWindow)=="undefined"?m.componentIFrame.contentDocument:m.componentIFrame.contentWindow;if(typeof(o.postMessage)!="undefined"){m.fireEvent=function(r,q){o.postMessage(a(Event.types.FIRE,r,q),"*")}}else{m.fireEvent=function(r,q){k(m,r,q)}}this.fireEvent(p,n)}};Event.registerAddEventListenerFunctionality=function(o,m){o.eventToListenerFnsMap=new Object();o.addEventListener=function(q,p){var r=o.eventToListenerFnsMap[q];if(typeof(r)=="undefined"){r=new Array();o.eventToListenerFnsMap[q]=r;g(o,q)}r[r.length]=p};o.invokeEventListeners=function(q,p){var s=o.eventToListenerFnsMap[q];if(typeof(s)!="undefined"){for(var r in s){s[r](p)}}};if(typeof(m)!="undefined"){var n=new Array();n[0]=m;o.eventToListenerFnsMap[Event.COMPONENT_LOADED_EVENT_NAME]=n}};Event.raise=function(o,n,m){if(typeof(m)=="undefined"){m=null}i(o,n,m)};Event.onMessage=function(q){var o=+(/.*eventType=([^&]*)/.exec(q.data)[1]);var r=unescape(/.*eventName=([^&]*)/.exec(q.data)[1]);var p=unescape(/.*eventProperties=([^&]*)/.exec(q.data)[1]);var n=q.origin;if(n=="null"){n="file://"}if(/:$/.test(n)){n+="//"}switch(o){case Event.types.FIRE:Component.fireEvent(n,r,p);break;case Event.types.RAISE:var m=unescape(/.*eventSourceId=([^&]*)/.exec(q.data)[1]);f(n,m,r,p);break;case Event.types.INFORM_OF_LISTENER_REGISTRATION:Component.informOfListenerRegistration(n,r);break}};Event.getEventUrl=function(){if(d==null){var n=jQuery('meta[name="eventUrl"]')[0];if(typeof(n)!="undefined"){d=n.content;var m=/(http(s)?:\/\/.*?)\//.exec(d);if(m==null){d=location.protocol+"//"+location.host+d}}else{d=undefined}}return d};Event.informParentOfEventUrl=function(n){if(location.search!=""){var o=/.*parentEventUrl=([^&]*)/.exec(location.search);if(o!=null){h=unescape(o[1])}var m=new Object();m.eventUrl=Event.getEventUrl();Event.raise(n,Event.REGISTER_CHILD_EVENT_URL,m)}};function k(q,o,m){var p=q.componentIFrame.id;var n=ComponentFactory.getComponentClassMeta(q.friendlyClassName).eventUrl;var r=n+"?componentIFrameId="+escape(p)+"&"+a(Event.types.FIRE,o,m);var s=j(p,r);jQuery("body").append(s)}function c(o,n,m){var p=h+"?"+a(Event.types.RAISE,n,m,o);var q=j("parent",p);jQuery("body").append(q)}function b(p,n){var o=p.componentIFrame.id;var m=ComponentFactory.getComponentClassMeta(p.friendlyClassName).eventUrl;var q=m+"?componentIFrameId="+escape(o)+"&"+a(Event.types.INFORM_OF_LISTENER_REGISTRATION,n,null);var r=j(o,q);jQuery("body").append(r)}function g(o,n){var m=(typeof(o.componentIFrame.contentWindow)=="undefined"||typeof(o.componentIFrame.contentWindow)=="unknown")?o.componentIFrame.contentDocument:o.componentIFrame.contentWindow;if(m==null){alert("Detected event listener registration ("+n+") before component ("+o.id+") was added to DOM.");return}if(!o.loaded){var p=e[o.id];if(typeof(p)=="undefined"){p=new Array();e[o.id]=p}p[p.length]=n;return}if(typeof(m.postMessage)!="undefined"){m.postMessage(a(Event.types.INFORM_OF_LISTENER_REGISTRATION,n,null),"*")}else{b(o,n)}}function j(n,p){var o="event_iframe_"+n;var q=document.createElement("iframe");q.id=o;q.src=p;q.style.display="none";var m=function(){if(q.removeEventListener){q.removeEventListener("load",arguments.callee,false)}else{if(q.detachEvent){q.detachEvent("onload",arguments.callee)}}document.body.removeChild(q)};if(q.addEventListener){q.addEventListener("load",m,false)}else{if(q.attachEvent){q.attachEvent("onload",m)}}return q}function a(o,n,m,p){return"eventType="+JSON.stringify(o)+"&eventName="+escape(JSON.stringify(n))+"&eventProperties="+escape((typeof(m)!="undefined"?JSON.stringify(m):JSON.stringify(null)))+(typeof(p)!="undefined"?"&eventSourceId="+escape(JSON.stringify(p)):"")}function f(x,o,m,v){var w=JSON.parse(o);var s=JSON.parse(m);var p=JSON.parse(v);var y=ComponentFactory.getPageComponent(w);var r=ComponentFactory.getComponentClassMeta(y.friendlyClassName);var u=r.origin;if(x==u){if(s==Event.REGISTER_CHILD_EVENT_URL){r.eventUrl=p.eventUrl;y.loaded=true;if(typeof(e[y.id])!="undefined"){var n=e[y.id];for(var t=0;t<n.length;t++){g(y,n[t])}e[y.id]=new Array()}var q=new Object();q.pageComponentId=y.id;y.invokeEventListeners(Event.COMPONENT_LOADED_EVENT_NAME,q)}else{y.invokeEventListeners(s,p)}}}var l=parent.postMessage?parent:parent.document;if(typeof(l.postMessage)!="undefined"){i=function(o,n,m){l.postMessage(a(Event.types.RAISE,n,m,o),"*")}}else{i=function(o,n,m){c(o,n,m)}}delete l;if(window.addEventListener){window.addEventListener("message",Event.onMessage,false)}else{if(window.attachEvent){window.attachEvent("onmessage",Event.onMessage)}}};