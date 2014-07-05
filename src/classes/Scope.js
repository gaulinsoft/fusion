/*! ------------------------------------------------------------------------
//                                   Fusion
//  ------------------------------------------------------------------------
//
//                       Copyright 2014 Nicholas Gaulin
//
//       Licensed under the Apache License, Version 2.0 (the "License");
//      you may not use this file except in compliance with the License.
//                   You may obtain a copy of the License at
//
//                 http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//      distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//                       limitations under the License.
*/

// ########## SCOPE ##########
var Scope   = function($state)
{
    // Set the scope parameters
    this.state = $state;
},
  __Scope__ = Scope.prototype = {};

// --- PROTOTYPE ---
__Scope__.braces      = 0;
__Scope__.brackets    = 0;
__Scope__.parentheses = 0;
__Scope__.state       = '';
__Scope__.tag         = '';
__Scope__.tags        = 0;

$_data(__Scope__, 'clone',  function()
{
    // Create the scope
    var $scope = new Scope(this.state);

    // Copy the scope parameters
    $scope.braces      = this.braces;
    $scope.brackets    = this.brackets;
    $scope.parentheses = this.parentheses;
    $scope.state       = this.state;
    $scope.tag         = this.tag;
    $scope.tags        = this.tags;

    // Return the scope
    return $scope;
}, true);
$_data(__Scope__, 'equals', function($scope)
{
    // Return true if the scope has the same state and counts
    return (this.braces      === $scope.braces
         && this.brackets    === $scope.brackets
         && this.parentheses === $scope.parentheses
         && this.state       === $scope.state
         && this.tag         === $scope.tag
         && this.tags        === $scope.tags);
}, true);