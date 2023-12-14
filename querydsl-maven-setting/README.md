# maven에서 querydsl Q class 생성


maven 환경에서 querydsl 를 사용하려고 했는데 Q class가 안생겨서 삽질했던 경험을 적어본다.

## pom.xml

```xml

<dependencies>
	<!-- other dependency  -->  
  
	<dependency>  
	  <groupId>com.querydsl</groupId>  
	  <artifactId>querydsl-apt</artifactId>  
	  <version>5.0.0</version>  
	</dependency>  
	  
	<dependency>  
	  <groupId>com.querydsl</groupId>  
	  <artifactId>querydsl-jpa</artifactId>  
	  <version>5.0.0</version>  
	</dependency>  
	<!-- other dependency -->

</dependencies>


<plugins>
	<plugin>  
	  <groupId>com.mysema.maven</groupId>  
	  <artifactId>apt-maven-plugin</artifactId>  
	  <version>1.1.3</version>  
	  <executions>    
		  <execution>      
			  <goals>        
				  <goal>process</goal>  
			  </goals>      
			  <configuration>        
				  <outputDirectory>target/generated-sources/java</outputDirectory>  
			      <processor>com.querydsl.apt.jpa.JPAAnnotationProcessor</processor> 
		      </configuration>    
		  </execution>  
	  </executions>
	</plugin>
</plugins>
```

처음에 이렇게 설정했는데 Q클래스가 생기지 않았다.

plugin에서 Entity 어노테이션을 Q클래스로 변경해주는데 아무설정을 안해주면 javax 패키지의 Entity만 찾는것이었다.

그래서 jakarta 패키지를 찾도록 설정을 하나 추가해야한다.

```xml
<dependency>  
  <groupId>com.querydsl</groupId>  
  <artifactId>querydsl-apt</artifactId>  
  <version>5.0.0</version>  
  <classifier>jakarta</classifier>  
</dependency>
```

요부분을 classifier를 jakarta로 설정해주면 된다.

JPAQueryFactory를 빈으로 등록하려 할때 EntityManager를 주입시키는데 이때도 jakarta 패키지의 EntityManager를 주입시키기 위해서는 다음과 같은 설정이 필요하다.

```xml
<dependency>
	<groupId>com.querydsl</groupId>
	<artifactId>querydsl-jpa</artifactId>
	<version>5.0.0</version>
	<classifier>jakarta</classifier>
</dependency>
```

## 최종 pom.xml

```xml

<dependencies>
	<!-- other dependency  -->  
	<dependency>  
	  <groupId>com.querydsl</groupId>  
	  <artifactId>querydsl-apt</artifactId>  
	  <version>5.0.0</version>  
	  <classifier>jakarta</classifier>
	</dependency>  
	  
	<dependency>  
	  <groupId>com.querydsl</groupId>  
	  <artifactId>querydsl-jpa</artifactId>  
	  <version>5.0.0</version>  
	  <classifier>jakarta</classifier>
	</dependency>  
	<!-- other dependency -->

</dependencies>


<plugins>
	<plugin>  
	  <groupId>com.mysema.maven</groupId>  
	  <artifactId>apt-maven-plugin</artifactId>  
	  <version>1.1.3</version>  
	  <executions>    
		  <execution>      
			  <goals>        
				  <goal>process</goal>  
			  </goals>      
			  <configuration>        
				  <outputDirectory>target/generated-sources/java</outputDirectory>  
			      <processor>com.querydsl.apt.jpa.JPAAnnotationProcessor</processor> 
		      </configuration>    
		  </execution>  
	  </executions>
	</plugin>
</plugins>
```

## 참고
[querydsl 이슈](https://github.com/querydsl/querydsl/issues/3371)