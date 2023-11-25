/*
 ____                         _                
|  _ \                       | |               
| |_) |  __ _  ___   ___   __| |     ___   _ __  
|  _ <  / _` |/ __| / _ \ / _` |    / _ \ | '_ \ 
| |_) || (_| |\__ \|  __/| (_| |   | (_) || | | |
|____/  \__,_||___/ \___| \__,_|    \___/ |_| |_|
  _______  _                                                  _      
 |__   __|| |                                                ( )     
    | |   | |__    ___   _ __ ___   _ __   ___   ___   _ __  |/  ___ 
    | |   | '_ \  / _ \ | '_ ` _ \ | '_ \ / __| / _ \ | '_ \    / __|
    | |   | | | || (_) || | | | | || |_) |\__ \| (_) || | | |   \__ \
    |_|   |_| |_| \___/ |_| |_| |_|| .__/ |___/ \___/ |_| |_|   |___/
                                   | |                               
                           _       |_|             _    _                          _                      _  _    _                
                          | |                     | |  (_)                        | |                    (_)| |  | |               
   ___   ___   _ __   ___ | |_  _ __  _   _   ___ | |_  _   ___   _ __       __ _ | |  __ _   ___   _ __  _ | |_ | |__   _ __ ___  
  / __| / _ \ | '_ \ / __|| __|| '__|| | | | / __|| __|| | / _ \ | '_ \     / _` || | / _` | / _ \ | '__|| || __|| '_ \ | '_ ` _ \ 
 | (__ | (_) || | | |\__ \| |_ | |   | |_| || (__ | |_ | || (_) || | | |   | (_| || || (_| || (_) || |   | || |_ | | | || | | | | |
  \___| \___/ |_| |_||___/ \__||_|    \__,_| \___| \__||_| \___/ |_| |_|    \__,_||_| \__, | \___/ |_|   |_| \__||_| |_||_| |_| |_|
                                                                                     __/ |                                       
                                                                                    |___/                                        


 */

// NFA state
function createState(isEnd) {
  return {
    isEnd,
    transition: {},
    epsilonTransition: []
  }
}


// Transitions
function addEpsilonTransition(from, to) {
  from.epsilonTransition.push(to)
}

function addTransition(from, to, symbol) {
  from.transition[symbol] = to
}

/* 
The NFA is simply an object which holds references to its start and end states.
By following the inductive rules, we build larger NFAs
by applying the three operations on smaller NFAs.
*/

/*                                                                                                                                                    
                                                                                                                                                      
                 :-============::                                                                                    .:-============:.                
              -*%=.            -=%=-                                                                               -%*-.            -*@=.             
            -%=                   .*%.                                                                           =@=   -***********=.  .%*.           
          -#:.                      .=#-                                                                      .=#: .=*=:           .-*=- :=*:         
        .**                            *=                                                                    .%-  *%.                  =%  .@=        
        %*                              %*                                                                   %-  %*                     -@-  %-       
       -*                               .@-                                                                 #*  #:                        #: .%       
       @                                  @                                                           @.   =@  **                         .%  =@      
       %             -=:== -:-.           @                                                           @@%  *#  @-         --:=: :=         @  =@      
       %            -@  @@=* .@           %-----------------------------------------------------------@@@@%%*  @-        *@  @= -@         %  -@      
       @            -@*-@@-% -%           @                           symbol/epsilon                 @@%=  =@  @=        *@=-@=  @         @  =@      
       #:            .::@@ :::.          =#                                                           @    :@: :%         .::@= :::.      -*  #=      
       .%              .--.             -@.                                                                 -%  -*          ---          -%  -*       
        *@.                            .@-                                                                   **  =@.                    **. -@.       
         :#-                         .=#.                                                                    =#- :**:               :=#- .*#.        
           =@=                      =%-                                                                         =%-  =**--       .-=*=  .*%.          
             -*=-.              .-=#-                                                                            .=*=:  ::===:-==-:. :==*:            
                -***=---  ---=***-                                       NFA                                         .=***---- .---***=-              
                    .--------.                                                                                           ---------                    
                non-accepting (start) state                                                                         accepting (end) state             
*/


//-------- ε-NFA -------------
function fromEpsilon() {
  const start = createState(false)
  const end = createState(true)
  addEpsilonTransition(start, end)

  return {start, end}
}


//------- symbol-NFA --------------
function fromSymbol(symbol) {
  const start = createState(false)
  const end = createState(true)

  addTransition(start, end, symbol)
  return {start, end}
}

// ---------- Applying Inductive Rules -------
function concat(first, second) {
    addEpsilonTransition(first.end, second.start);
    first.end.isEnd = false;

    return { start: first.start, end: second.end };
}

function union(first, second) {
  const start = createState(false)
  addEpsilonTransition(start, first.start)
  addEpsilonTransition(start, second.start)

  const end = createState(true)

  addEpsilonTransition(first.end, end)
  first.end.isEnd = false
  addEpsilonTransition(second.end, end)
  second.end.isEnd = false

  return {start, end}
}

function closure(nfa) {
  const start = createState(false)
  const end = createState(true)

  addEpsilonTransition(start, end)
  addEpsilonTransition(start, nfa.start)
  addEpsilonTransition(nfa.end, end)
  addEpsilonTransition(nfa.end, nfa.start)

  nfa.end.isEnd = false

  return{start, end}
}