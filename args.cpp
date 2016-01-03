#include <cstdio>
#include <cstdlib>
#include <iostream>
using namespace std;
void proccess(int,char* []);
int main(int nNumberofArgs, char* pszArgs[]){
	cout << "Proccessing...";
	proccess(nNumberofArgs,pszArgs);
    system("PAUSE");
    return 0;
    }
void proccess(int n,char* args[]){
	    for(int i= 1; i<n;i++){
    	if(*args[i]=='c'){
    		cout << 'c';
    	}
    	else{
    		cout<<args[i];
		}
    }
}
